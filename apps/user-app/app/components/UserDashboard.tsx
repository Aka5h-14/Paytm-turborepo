import { Card } from "@repo/ui";


// User type
interface User {
  number?: string;
  id?: number;
  name?: string | null;
  email?: string | null;
}

export const UserDashboard = ({
  user,
}: {
  user: {
    OnRampTransaction: {
      id: number;
      token: string;
      status: String;
      provider: string;
      amount: number;
      startTime: Date;
      userId: number;
    }[];
    Balance: {
      id: number;
      userId: number; // Unique to User
      amount: number; // Total balance
      locked: number; // Locked balance
    }[];
    receivedTransfers: {
      id: number;
      amount: number; // Transfer amount
      timestamp: Date; // Transfer timestamp
      fromUserId: number; // Sender user ID
      fromUser?: User | null; // Sender user reference (optional)
      toUserId: number; // Recipient user ID
      toUser?: User | null; // Recipient user reference (optional)
    }[];
    sentTransfers: {
      id: number;
      amount: number; // Transfer amount
      timestamp: Date; // Transfer timestamp
      fromUserId: number; // Sender user ID
      fromUser?: User | null; // Sender user reference (optional)
      toUserId: number; // Recipient user ID
      toUser?: User | null; // Recipient user reference (optional)
    }[];
  } & (User | null);
}) => {
  if (!user) {
    return (
      <>
        <Card title="Recent Transactions">
          <div className="text-center pb-8 pt-8">No Recent transactions</div>
        </Card>
      </>
    );
  }
  return (
    
    <div>
      <div className="p-2 sm:p-8 w-full bg-gray-50 min-h-screen">

        <div className="bg-white shadow rounded-lg p-2 sm:p-6">
          <h2 className="text-xl text-[#6a51a6] font-semibold mb-4">User Overview</h2>
          <p className="text-gray-700 text-sm sm:text-base">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            <strong>Number:</strong> {user.number}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Balance</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              <strong>Total Balance:</strong> ₹
              {user.Balance[0]?.amount ? user.Balance[0]?.amount / 100 : 0}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <strong>Locked Balance:</strong> ₹{user.Balance[0]?.locked}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto bg-white shadow rounded-lg p-2 sm:p-6">
          <h3 className="text-xl text-[#6a51a6] font-semibold mb-4">OnRamp Transactions</h3>
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 p-2">Provider</th>
                <th className="border border-gray-200 p-2">Amount</th>
                <th className="border border-gray-200 p-2">Status</th>
                <th className="border border-gray-200 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {user.OnRampTransaction.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">{txn.provider}</td>
                  <td className="border border-gray-200 p-2">
                    ₹{txn.amount / 100}
                  </td>
                  <td className="border border-gray-200 p-2">{txn.status}</td>
                  <td className="border border-gray-200 p-2">
                    {new Date(txn.startTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 overflow-x-auto bg-white shadow rounded-lg p-2 sm:p-6">
          <h3 className="text-xl text-[#6a51a6] font-semibold mb-4">P2P Transfers</h3>

          <h4 className="text-lg  font-medium mb-2">Sent Transfers</h4>
          <table className="table-auto w-full border-collapse border border-gray-200 mb-6 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 p-2">Amount</th>
                <th className="border border-gray-200 p-2">To</th>
                <th className="border border-gray-200 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {user.sentTransfers.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">
                    ₹{txn.amount / 100}
                  </td>
                  <td className="border border-gray-200 p-2">{txn.toUser?.number}</td>
                  <td className="border border-gray-200 p-2">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-lg overflow-x-auto font-medium mb-2">Received Transfers</h4>
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 p-2">Amount</th>
                <th className="border border-gray-200 p-2">From</th>
                <th className="border border-gray-200 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {user.receivedTransfers.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">
                    ₹{txn.amount / 100}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {txn.fromUser?.number}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
