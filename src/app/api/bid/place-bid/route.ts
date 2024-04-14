import { db } from "@auction/lib/db";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
	slug: z.string().min(1, { message: "Must provide item slug" }),
	amount: z.number(),
});

export const POST = async (req: NextRequest) => {
	try {
		const json = await req.json();

		const res = requestSchema.safeParse(json);

		if (!res.success) {
			return NextResponse.json({ error: res.error }, { status: 400 });
		}

		const { slug, amount } = res.data;

		// Start transaction
		const result = await db.$transaction(async (prisma) => {
			// Fetching current highest bid and item data
			const item = await prisma.item.findUnique({
				where: { slug },
				include: { highestBid: true },
			});

			if (!item) throw new Error("Item not found");

			// Validate if new bid is higher than current highest bid
			if (item.highestBid && amount <= item.highestBid.amount) {
				throw new Error("New bid must be higher than the current highest bid");
			}

			// Create new bid entry
			const bid = await prisma.bid.create({
				data: {
					amount,
					bidder: { connect: { id: 3 } }, // TODO Hardcoded user id for now
					item: { connect: { id: item.id } },
				},
			});

			// Update item with new highest bid
			await prisma.item.update({
				where: { id: item.id },
				data: { highestBidId: bid.id },
			});

			return bid;
		});

		return NextResponse.json(
			{ payload: result, success: true },
			{ status: 200 },
		);
	} catch (e: unknown) {
		const error = e as Error;
		console.log({ error });
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};
