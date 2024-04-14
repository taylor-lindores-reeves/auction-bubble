import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse";
import { env } from "@auction/env";

function makePrisma() {
	return new PrismaClient().$extends(withPulse({ apiKey: env.PULSE_API_KEY }));
}

type ExtendedPrismaClient = ReturnType<typeof makePrisma>;

const globalForPrisma = globalThis as unknown as {
	prisma: ExtendedPrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? makePrisma();

if (env.APP_ENV !== "production") globalForPrisma.prisma = db;
