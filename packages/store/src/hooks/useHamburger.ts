import { useRecoilState } from "recoil";
import { hamburgerAtom } from "../atoms/hamburger";

export const useHamburger = () => {
  const [hamburger, setHamburger] = useRecoilState(hamburgerAtom);

  return { hamburger , setHamburger };
};

