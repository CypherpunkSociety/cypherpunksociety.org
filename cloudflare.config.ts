import { defineConfig } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };

export default defineConfig({
	worker: {
		name: "cypherpunksociety-org",
		compatibilityDate: "2026-10-27",
		entrypoint,
		domains: ["cypherpunksociety.org", "www.cypherpunksociety.org"],
		observability: {
			enabled: true,
			traces: {
				enabled: true,
			},
		},
	},
});
