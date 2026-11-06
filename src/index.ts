// Cypherpunk Society site Worker.
//
// Static pages are served from public/ as Worker assets before this code runs.
// This handler only sees requests that did not match an asset:
//   POST /api/signup  - mailing-list / volunteer-interest form on index.html
//   GET  /join        - short link to the form
//   anything else     - 404
//
// Signups are stored in the SIGNUPS KV namespace. We keep the email, the
// optional handle, the interests ticked, a short note and a timestamp. We do
// not store IP addresses or user agents; a hashed IP lives in a one-hour
// rate-limit key only.

const INTERESTS = new Set([
	"list", // monthly mailing list
	"clinic", // clinic mentor
	"osint", // OSINT challenges and FOIA sprints
	"infra", // USB station, Kiwix mirror, Tor bridges
	"speakers", // speaker liaison
	"repo", // awesome-cypherpunk maintainer
]);

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const RATE_LIMIT = 5; // submissions per IP per hour

interface Signup {
	email: string;
	name: string;
	interests: string[];
	note: string;
	createdAt: string;
	updatedAt?: string;
	source: string;
}

function clip(value: unknown, max: number): string {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
	const type = request.headers.get("content-type") ?? "";
	if (type.includes("application/json")) {
		const body = (await request.json()) as Record<string, unknown>;
		return body && typeof body === "object" ? body : {};
	}
	const form = await request.formData();
	const out: Record<string, unknown> = {};
	for (const [key, value] of form.entries()) {
		if (typeof value !== "string") continue;
		if (key === "interests") {
			out.interests = [...((out.interests as string[]) ?? []), value];
		} else {
			out[key] = value;
		}
	}
	return out;
}

async function sha256Hex(text: string): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function wantsJson(request: Request): boolean {
	const accept = request.headers.get("accept") ?? "";
	const type = request.headers.get("content-type") ?? "";
	return accept.includes("application/json") || type.includes("application/json");
}

function reply(request: Request, status: number, ok: boolean, message: string): Response {
	if (wantsJson(request)) {
		return Response.json({ ok, message }, { status });
	}
	// No-JS fallback: bounce back to the form with a status flag.
	const flag = ok ? "joined=1" : `join_error=${encodeURIComponent(message)}`;
	return Response.redirect(`${new URL(request.url).origin}/?${flag}#join`, 303);
}

async function handleSignup(request: Request, env: Env): Promise<Response> {
	let body: Record<string, unknown>;
	try {
		body = await parseBody(request);
	} catch {
		return reply(request, 400, false, "Could not read the form.");
	}

	// Honeypot: real browsers leave this empty.
	if (clip(body.website, 10)) {
		return reply(request, 200, true, "Thanks, you are on the list.");
	}

	const email = clip(body.email, 254).toLowerCase();
	if (!EMAIL_RE.test(email)) {
		return reply(request, 400, false, "That email address does not look right.");
	}

	const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
	const rateKey = `rl:${await sha256Hex(ip)}`;
	const used = Number((await env.SIGNUPS.get(rateKey)) ?? "0");
	if (used >= RATE_LIMIT) {
		return reply(request, 429, false, "Too many signups from this connection. Try again in an hour.");
	}
	await env.SIGNUPS.put(rateKey, String(used + 1), { expirationTtl: 3600 });

	const rawInterests = Array.isArray(body.interests)
		? body.interests
		: typeof body.interests === "string"
			? [body.interests]
			: [];
	const interests = [...new Set(rawInterests.map((v) => clip(v, 20)).filter((v) => INTERESTS.has(v)))];
	if (interests.length === 0) interests.push("list");

	const now = new Date().toISOString();
	const emailKey = `email:${await sha256Hex(email)}`;
	const existingKey = await env.SIGNUPS.get(emailKey);

	if (existingKey) {
		const previous = await env.SIGNUPS.get<Signup>(existingKey, "json");
		if (previous) {
			const merged: Signup = {
				...previous,
				name: clip(body.name, 120) || previous.name,
				interests: [...new Set([...previous.interests, ...interests])],
				note: clip(body.note, 500) || previous.note,
				updatedAt: now,
			};
			await env.SIGNUPS.put(existingKey, JSON.stringify(merged));
			return reply(request, 200, true, "Already on the list; we updated your interests.");
		}
	}

	const record: Signup = {
		email,
		name: clip(body.name, 120),
		interests,
		note: clip(body.note, 500),
		createdAt: now,
		source: clip(body.source, 40) || "web",
	};
	const key = `signup:${now}:${crypto.randomUUID().slice(0, 8)}`;
	await env.SIGNUPS.put(key, JSON.stringify(record));
	await env.SIGNUPS.put(emailKey, key);

	return reply(request, 200, true, "Thanks, you are on the list. See you at Frontier Tower.");
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === "/api/signup") {
			if (request.method !== "POST") {
				return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
			}
			return handleSignup(request, env);
		}

		if (url.pathname === "/join" || url.pathname === "/join/") {
			return Response.redirect(`${url.origin}/#join`, 302);
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
