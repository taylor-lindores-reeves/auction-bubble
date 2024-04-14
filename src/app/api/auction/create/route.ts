import type { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@auction/lib/db";

export async function POST(req: NextRequest) {
	const payload: Prisma.ItemCreateInput = {
		slug: "vintage-pocket-watch", // This should be the same as the slug in the URL
		title: "Vintage Pocker Watch",
		description:
			"This antique pocket watch is a rare find. It's a perfect addition to any vintage collection.",
		image: "https://fakeimg.pl/800x800/",
		endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
		startingPrice: 0,
		reservePrice: 10000,
		bidIncrements: 100,
		seller: { connect: { id: 1 } },
		bids: {
			createMany: {
				data: [
					{
						id: 1,
						amount: 100,
						bidderId: 2,
					},
					{
						id: 2,
						amount: 200,
						bidderId: 3,
					},
				],
			},
		},
	};

	try {
		const auction = await db.item.create({ data: payload });
		return NextResponse.json({ auction }, { status: 201 });
	} catch (e: unknown) {
		const error = e as Error;

		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
