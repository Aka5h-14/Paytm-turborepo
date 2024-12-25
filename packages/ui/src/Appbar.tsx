import { Button } from "./button";

interface AppbarProps {
  user?: { name?: string | null };
  onSignin: () => void;
  onSignout: () => void;
  // hamburger: boolean ;
  // setHamburger: (value: boolean) => void;
}

export const Appbar = ({ user, onSignin, onSignout 
  // , hamburger , setHamburger 

}: AppbarProps) => {
  return (
    <div className="flex justify-between items-center border-b px-4 py-2">
      <button
        className="sm:hidden p-2 bg-gray-100 rounded-md shadow-md"
        // onClick={() => {setHamburger(true)}}
      >
        <HamburgerIcon />
      </button>

      <div className="text-lg font-semibold">PayTM</div>

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
