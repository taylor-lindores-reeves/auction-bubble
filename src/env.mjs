import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		APP_ENV: z.enum(["development", "production"]),
		DATABASE_URL: z.string().url(),
		PULSE_API_KEY: z.string().min(1),
	},
	runtimeEnv: {
		APP_ENV: process.env.APP_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		PULSE_API_KEY: process.env.PULSE_API_KEY,
	},
});
