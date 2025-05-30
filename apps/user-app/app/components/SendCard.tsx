"use client";

import { Center } from "@repo/ui";
import { TextInput } from "@repo/ui";
import { useState } from "react";
import { p2pTransfer } from "../lib/actions/p2pTransfer";
import { p2pInputs } from "@repo/zodtypes/types";
import { useAppDispatch } from "@repo/store/hooks";
import { errorTrue, setMessage, setSeverity } from "@repo/store/ErrorSlice";
import { Card } from "@repo/ui";
import { Button } from "@repo/ui";
import { changeLoading } from "@repo/store/LoadingSlice";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useAppDispatch();

  return (
    <div>
      <Center>
        <Card title="Send">
          <div className="w-full lg:w-80 pt-2">
            <TextInput
              type="number"
              placeholder={"Number"}
              label="Number"
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              type="number"
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => {
                setAmount(value);
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button
                onClick={async () => {
                  dispatch(changeLoading(true));

                  const typeCheck = p2pInputs.safeParse({
                    to: number,
                    amount: Number(amount) * 100,
                  });

                  if (!typeCheck.success) {
                    dispatch(errorTrue());
                    const errorMessage =
                      typeCheck.error?.errors[0]?.message ||
                      "An error occurred";
                    dispatch(setMessage(errorMessage));
                    dispatch(setSeverity("warning"));
                    return;
                  }
                  const res = await p2pTransfer(number, Number(amount) * 100);

                  if (res?.message) {
                    dispatch(errorTrue());
                    dispatch(setMessage(res.message));
                    dispatch(setSeverity("warning"));
                    return;
                  }
                  dispatch(changeLoading(false));
                  window.location.href = window.location.href;
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}
