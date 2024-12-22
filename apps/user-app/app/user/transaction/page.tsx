import { AllTransaction } from "../../components/AllTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { redirect } from 'next/navigation'

async function getAllTxns() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  // if (!userId) {
  //   redirect("api/auth/signin");
  // } 

  // Fetch bank transactions
  const bankTxns = await prisma.onRampTransaction.findMany({
    where: { userId: userId },
  });

  // Map bank transactions to required format
  const formattedBankTxns = bankTxns.map((t) => ({
    time: t.startTime,
    amount: t.amount/100,
    status: t.status,
    type: "Bank",
    bankName: t.provider,
  }));

  // Fetch P2P transactions
  const p2pTxns = await prisma.p2pTransfer.findMany({
    where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
    include: { fromUser: true, toUser: true },
  });

  // Map P2P transactions to required format
  const formattedP2PTxns = p2pTxns.map((t) =>
    t.fromUserId === userId
      ? {
          time: t.timestamp,
          amount: t.amount/100,
          status: "Sent",
          type: "P2P",
          sentTo: t.toUser.number,
        }
      : {
          time: t.timestamp,
          amount: t.amount/100,
          status: "Received",
          type: "P2P",
          receiver: t.fromUser.number,
        }
  );

  const allTxns = [...formattedBankTxns, ...formattedP2PTxns].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return allTxns;
}

export default async function () {
  const transaction = await getAllTxns();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        All Transactions
      </div>
      <div className="w-full grid grid-cols-1 p-4">
        <div className="pt-4">
          <AllTransaction transactions={transaction} />
        </div>
      </div>
    </div>
  );
}
