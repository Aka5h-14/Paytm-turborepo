
import { click } from "@repo/store/HamburgerSlice";
import { useAppDispatch, useAppSelector } from "@repo/store/hooks";
import  Button  from "./Button";

interface AppbarProps {
  user?: { name?: string | null };
  onSignin: () => void;
  onSignout: () => void;
}

export default function AppBar({ 
  user, onSignin, onSignout 
}: AppbarProps) {

  const hamburger = useAppSelector((state:any) => state.hamburger.value);
  const dispatch = useAppDispatch(); 

  return (
    <div className="flex justify-between items-center border-b px-4 py-2">
      <button
        className="sm:hidden p-2 bg-gray-100 rounded-md"
        onClick={() => {dispatch(click())}}
      >
        <HamburgerIcon />
      </button>

      <a className="text-lg font-semibold" href="/">PayTM</a>

      <div>
        <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
      </div>
    </div>
  );
};

// Hamburger Icon
function HamburgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
    </svg>
  );
}
