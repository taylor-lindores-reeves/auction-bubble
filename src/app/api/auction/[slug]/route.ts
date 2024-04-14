import { db } from "@auction/lib/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } },
) {
	const { slug } = params;

	try {
		const item = await db.item.findUnique({
			where: { slug },
			include: { bids: { include: { bidder: true } } },
		});

		return NextResponse.json({ payload: item }, { status: 200 });
	} catch (e: unknown) {
		const error = e as Error;

		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
