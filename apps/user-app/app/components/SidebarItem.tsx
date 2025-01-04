"use client";
import { click } from "@repo/store/HamburgerSlice";
import { useAppDispatch } from "@repo/store/hooks";
import { changeLoading } from "@repo/store/LoadingSlice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    dispatch(changeLoading()); // Start loading
    dispatch(click()); // Close sidebar

    router.push(href);
    setTimeout(()=>{
      dispatch(changeLoading()); // Stop loading after navigation
    },800)
  };

  return (
    <div
      className={`flex ${selected ? "text-[#6a51a6]" : "text-slate-500"} cursor-pointer p-2 lg:pl-8`}
      onClick={() => {
        handleClick();
      }}
    >
      <div className="pr-2">{icon}</div>
      <div
        className={`font-semibold ${selected ? "text-[#6a51a6] font-extrabold" : "text-slate-500"}`}
      >
        {title}
      </div>
    </div>
  );
};
