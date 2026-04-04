import "dotenv/config";
import * as PrismaPgModule from "@prisma/adapter-pg";
import * as PrismaClientModule from "@prisma/client";

const { PrismaPg } = PrismaPgModule;
const { PrismaClient } = PrismaClientModule;

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export { prisma };