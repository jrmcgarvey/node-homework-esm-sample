import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const opts = { adapter };
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  opts.log = ["query"];
}

// console.log("PrismaClient: ", PrismaClient)
const prisma = new PrismaClient(opts);
// console.log("prisma", prisma)
export default prisma