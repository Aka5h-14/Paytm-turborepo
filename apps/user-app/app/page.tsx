"use client";
// import { increment } from "@repo/store/CounterSlice";
// import { useAppDispatch, useAppSelector } from "@repo/store/hooks";
import { redirect } from "next/navigation";

export default function Page() {

  redirect("/user/dashboard");

  // const count = useAppSelector((state) => state.counter.value);
  // const dispatch = useAppDispatch();
  return (
    <div>
      Welcome to Paytm
      {/* count is {count}
    <button className="border-2" onClick={()=>{ dispatch(increment())}}>increment</button> */}
    </div>
  );
}
