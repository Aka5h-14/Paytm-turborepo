import { useRecoilState } from "recoil";
import { balanceAtom } from "../atoms/balance";

export const useBalance = () => {
  const [balance, setBalance] = useRecoilState(balanceAtom);

  // Return both balance and a setter function
  return { balance, setBalance };
};
