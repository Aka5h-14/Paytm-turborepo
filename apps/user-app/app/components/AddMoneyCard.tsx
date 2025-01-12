"use client";

import { Select } from "@repo/ui";
import { useState } from "react";
import { TextInput } from "@repo/ui";
import { createOnRampTransaction } from "../lib/actions/createOnrampTransaction";
import { Center } from "@repo/ui";
import { onRampInputs } from "@repo/zodtypes/types";
import { useAppDispatch } from "@repo/store/hooks";
import { errorTrue, setMessage, setSeverity } from "@repo/store/ErrorSlice";
import { Card } from "@repo/ui";
import { Button } from "@repo/ui";
import { changeLoading } from "@repo/store/LoadingSlice";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://omni.axisbank.co.in/axisretailbanking/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  const [value, setValue] = useState(0);
  const dispatch = useAppDispatch();

  return (
    <Center>
      <Card title="Add Money">
        <div className="w-full">
          <TextInput
            type="number"
            label={"Amount"}
            placeholder={"Amount"}
            onChange={(val) => {
              setValue(Number(val));
            }}
          />
          <div className="py-4 text-left">Bank</div>
          <Select
            onSelect={(value) => {
              setRedirectUrl(
                SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
              );
              setProvider(
                SUPPORTED_BANKS.find((x) => x.name === value)?.name || ""
              );
            }}
            options={SUPPORTED_BANKS.map((x) => ({
              key: x.name,
              value: x.name,
            }))}
          />
          <div className="flex justify-center pt-4">
            <Button
              onClick={async () => {
                dispatch(changeLoading(true));
                const typeCheck = onRampInputs.safeParse({
                  provider,
                  amount: Number(value) * 100,
                });
                if (!typeCheck.success) {
                  dispatch(errorTrue());
                  const errorMessage =
                    typeCheck.error?.errors[0]?.message || "An error occurred";
                  dispatch(setMessage(errorMessage));
                  dispatch(setSeverity("warning"));
                  return;
                }
                await createOnRampTransaction(provider, value);
                if (redirectUrl) {
                  window.open(redirectUrl, "_blank");
                }
                dispatch(changeLoading(false));
                window.location.href = window.location.href;
              }}
            >
              Add Money
            </Button>
          </div>
        </div>
      </Card>
    </Center>
  );
};
