import { PrismaClient } from "@prisma/client";

// Singleton logic
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declare global variable for Prisma in development
declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma =
  globalThis.prismaGlobal ??
  prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
