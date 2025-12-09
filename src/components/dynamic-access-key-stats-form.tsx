"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Input,
  useDisclosure,
} from "@heroui/react";

import { StatsIcon } from "@/src/components/icons";
import { DynamicAccessKeyStats } from "@/src/core/definitions";
import DynamicAccessKeyValidityChip from "@/src/components/dynamic-access-key-validity-chip";
import DynamicAccessKeyDataUsageChip from "@/src/components/dynamic-access-key-data-usage-chip";
import NoResult from "@/src/components/no-result";
import { getDynamicAccessKeyStatsByPath } from "@/src/core/actions/dynamic-access-key";
import MessageModal from "@/src/components/modals/message-modal";

function extractPath(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
    const pathSegments = path
      .split("/")
      .filter((segment) => segment.length > 0);

    const dakIndex = pathSegments.indexOf("dak");
    if (dakIndex === -1 || dakIndex === pathSegments.length - 1) {
      return null;
    }

    return slugify(pathSegments[dakIndex + 1]);
  } catch {
    return null;
  }
}

interface FormProps {
  accessKey: string;
}

// TODO: add captcha
export default function DynamicAccessKeyStatsForm() {
  const form = useForm<FormProps>();
  const [stats, setStats] = useState<DynamicAccessKeyStats | null>();
  const errorModalDisclosure = useDisclosure();
  const [error, setError] = useState<string>();

  const actualSubmit = async (data: FormProps) => {
    try {
      const path = extractPath(data.accessKey);

      if (path) {
        setStats(await getDynamicAccessKeyStatsByPath(path));
      } else {
        setStats(null);
      }
    } catch (err) {
      setError((err as object).toString());
      errorModalDisclosure.onOpen();
    }
  };

  const handleReset = () => {
    form.reset();
    setStats(undefined);
  };

  return (
    <div className="grid gap-8">
      <MessageModal
        title="အမှား!"
        disclosure={errorModalDisclosure}
        body={
          <div className="grid gap-2">
            <span>တစ်ခုခုမှားသွားပါတယ်။</span>
            <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">
              {error}
            </pre>
          </div>
        }
      />

      <form
        className="flex flex-col items-center justify-center gap-2"
        onSubmit={form.handleSubmit(actualSubmit)}
      >
        <div className="mb-8 text-foreground grid gap-2 place-items-center px-4">
          <StatsIcon size={86} />
          <div className="text-center">
            သင့် Access Key ကိုထည့်ပြီး သုံးစွဲမှုစာရင်းကို ကြည့်ရှုနိုင်ပါတယ်
          </div>
        </div>

        <Input
          className="w-[320px]"
          color="primary"
          label="Access Key"
          placeholder="Access Key ကို ဒီမှာကူးထည့်ပါ"
          variant="underlined"
          errorMessage={form.formState.errors.accessKey?.message}
          isInvalid={!!form.formState.errors.accessKey}
          {...form.register("accessKey", {
            required: "Access Key ထည့်ပါ",
            maxLength: 512,
          })}
        />

        <ButtonGroup className="w-[320px]" fullWidth>
          <Button
            color="primary"
            isLoading={form.formState.isSubmitting}
            type="submit"
            variant="shadow"
          >
            စစ်မယ်
          </Button>

          {stats !== undefined && (
            <Button variant="shadow" onPress={handleReset}>
              ပြန်စမယ်
            </Button>
          )}
        </ButtonGroup>
      </form>

      {stats !== undefined &&
        (stats ? (
          <Card className="w-[320px] mx-auto">
            <CardHeader>
              <div className="grid gap-1">
                <span className="max-w-[320px] truncate">
                  {stats.name}
                </span>
                <span className="max-w-[320px] truncate text-foreground-400 text-sm">
                  {stats.path}
                </span>
              </div>
            </CardHeader>

            <CardBody className="text-sm grid gap-2">
              <div className="flex gap-1 justify-between items-center">
                <span>ဒေတာသုံးစွဲမှု</span>
                <DynamicAccessKeyDataUsageChip item={stats} />
              </div>

              <div className="flex gap-1 justify-between items-center">
                <span>သက်တမ်း</span>
                <DynamicAccessKeyValidityChip dak={stats} />
              </div>
            </CardBody>
          </Card>
        ) : (
          <NoResult message="ရလဒ်မတွေ့ပါ" />
        ))}
    </div>
  );
}
