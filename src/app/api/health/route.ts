import { NextResponse } from "next/server";
export function GET() {
	return NextResponse.json({ message: "Server is healthy!" }, { status: 200 });
}
