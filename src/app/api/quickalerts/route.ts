import { env } from "@quickalerts/env.mjs";
import { NextResponse } from "next/server";
import type { Twilio } from "twilio";

const client: Twilio = require("twilio")(env.ACCOUNTSID, env.AUTHTOKEN);

export const POST = async (req: Request) => {
	try {
		// const res = await req.json();

		// console.log({ res });

		await client.messages.create({
			body: "New Quick Alert!",
			from: "+447782642204",
			to: "+447947790914",
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.log(error);
		return NextResponse.error();
	}
};
