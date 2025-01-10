import { Card } from "@repo/ui";


export const AllTransaction = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: String; // More specific type for `status`
    type: String;
    sentTo?: string;
    receiver?: string;
    bankName?: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent Transactions</div>
      </Card>
    );
  }

  return (
    <Card title="All Transactions">
      <div className="pt-4 overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Sent To</th>
              <th className="border border-gray-300 px-4 py-2">Received From</th>
              <th className="border border-gray-300 px-4 py-2">Bank Name</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                    <td className="border border-gray-300 px-4 py-2">
                      ₹{t.amount}
                    </td>
                <td className="border border-gray-300 px-4 py-2">{t.status}</td>
                <td className="border border-gray-300 px-4 py-2">{t.type}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(t.time).toLocaleDateString()}{" "}
                  {new Date(t.time).toLocaleTimeString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {t.sentTo || ""}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {t.receiver || ""}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {t.bankName || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
