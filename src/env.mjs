import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		APP_ENV: z.enum(["development", "production"]),
		ACCOUNTSID: z.string().min(1),
		AUTHTOKEN: z.string().min(1),
	},
	runtimeEnv: {
		APP_ENV: process.env.APP_ENV,
		ACCOUNTSID: process.env.ACCOUNTSID,
		AUTHTOKEN: process.env.AUTHTOKEN,
	},
});
