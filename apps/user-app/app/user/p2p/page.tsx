import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { SendCard } from "../../components/SendCard";
import { P2pTransaction } from "../../components/P2pTransaction";

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);

  const userId = Number(session?.user.id); 

  const allTxns = await prisma.p2pTransfer.findMany({
    where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
    include: {
        fromUser: true,
        toUser: true 
    }
  });

  const formattedRecTxns = allTxns.map((t : any ) => {
    if(t.fromUserId == userId){
        return {
            time: t.timestamp,
            amount: t.amount,
            status: "Sent",
            sentTo: t.toUser.number,
        }
    }
    else{
        return {
            time: t.timestamp,
            amount: t.amount,
            status: "Received",
            receiver: t.toUser.number,
        }
    }
  });

  formattedRecTxns.sort(
    (a : any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return formattedRecTxns;
}

export default async function () {
  const transactions = await getP2pTransactions();
  return (
    <div className="w-full">
      <div className="text-3xl sm:text-4xl text-[#6a51a6] pt-4 sm:pt-8 mb-2 sm:mb-4 pl-4 font-bold ">
        Person To Person Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 sm:p-8">
        <div>
          <SendCard />
        </div> 
        <div className="my-auto">
          <P2pTransaction transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
