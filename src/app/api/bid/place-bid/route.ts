import { db } from "@auction/lib/db";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
	slug: z.string().min(1, { message: "Must provide item slug" }),
	amount: z.number(),
});

export const POST = async (req: NextRequest) => {
	const res = requestSchema.safeParse(await req.json());

	if (!res.success) {
		return NextResponse.json({ error: res.error }, { status: 400 });
	}

	try {
		const { slug, amount } = res.data;
		await db.bid.create({
			data: {
				amount,
				bidder: { connect: { id: 3 } },
				item: {
					connect: { slug },
				},
			},
		});
	} catch (e: unknown) {
		const error = e as Error;

		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};
