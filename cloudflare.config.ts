import { bindings, defineConfig } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };

export default defineConfig({
	worker: {
		name: "cypherpunksociety-org",
		compatibilityDate: "2026-10-27",
		entrypoint,
		domains: ["cypherpunksociety.org", "www.cypherpunksociety.org"],
		env: {
			// Mailing-list / volunteer signups from the form on index.html.
			// Namespace "cypherpunksociety-signups" (created 2026-11-05).
			SIGNUPS: bindings.kv({ id: "8163ea2f0d414de991035b6dbf390392" }),
		},
		observability: {
			enabled: true,
			traces: {
				enabled: true,
			},
		},
	},
});
