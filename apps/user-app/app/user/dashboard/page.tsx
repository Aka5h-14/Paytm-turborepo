import { getServerSession } from "next-auth";
import { UserDashboard } from "../../components/UserDashboard";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";

async function getDetails() {
  const session = await getServerSession(authOptions);
  // if (!session) {
  //   throw new Error("No session found");
  // } 

  const userId = Number(session?.user?.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      number: true,
      Balance: true, // Include balance details
      OnRampTransaction: true, // Include on-ramp transactions
      sentTransfers: {
        include: {
          toUser: {
            select: {
              number :true
            },
          },
        },
      }, // Include recipient details for sent transfers
      receivedTransfers: {
        include: {
          fromUser: {
            select: {
              number :true
            },
          },
        },
      }, // Include sender details for received transfers
    },
  });
  

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export default async function Dashboard() {
  const user = await getDetails();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        User Dashboard
      </div>
      <div className="w-full grid grid-cols-1 p-4">
        <div className="pt-4">
          <UserDashboard user={user} />
        </div>
      </div>
    </div>
  );
}