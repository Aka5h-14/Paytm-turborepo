import { Card } from "@repo/ui/card";

export const P2pTransaction = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    // TODO: Can the type of `status` be more specific?
    status: String;
    sentTo?: String;
    receiver?: String;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="All Transactions">
      <div className="pt-2">
        {transactions.map((t) => (
          <div className="flex justify-between py-1">
            <div>
              <div className="text-sm">
                {t.status == "Received"
                  ? `Received INR From (${t.receiver})`
                  : `Sent INR To (${t.sentTo})`}
              </div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {t.status == "Received" ? "+" : "-"} Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
