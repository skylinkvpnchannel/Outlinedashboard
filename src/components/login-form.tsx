"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@heroui/react";
import { checkPassword, login } from "@/src/core/actions";
import { Logo } from "@/src/components/icons";

interface FormProps {
  password: string;
}

export default function LoginForm() {
  const form = useForm<FormProps>();
  const [showPassword, setShowPassword] = useState(false);

  const actualSubmit = async (data: FormProps) => {
    const userId = await checkPassword(data.password);
    if (userId) {
      await login(userId);
    } else {
      form.setError("password", {
        type: "custom",
        message: "စကားဝှက်မမှန်ပါ။",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-content2">
      {/* soft background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <form
        onSubmit={form.handleSubmit(actualSubmit)}
        className="
          relative w-full max-w-md
          rounded-3xl border border-default-200/60
          bg-content1/80 backdrop-blur-xl
          shadow-2xl shadow-black/10
          p-8 sm:p-10
          flex flex-col gap-5
        "
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="grid place-items-center h-20 w-20 rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Logo size={56} />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Outline Dashboard
            </h1>
            <p className="mt-1 text-sm sm:text-base text-default-600">
              Server နဲ့ Access Key တွေ စီမံရန် ဝင်ရောက်ပါ
            </p>
          </div>
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Input
            className="w-full"
            color="primary"
            errorMessage={form.formState.errors.password?.message}
            isInvalid={!!form.formState.errors.password}
            label="Admin Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            variant="bordered"
            radius="lg"
            size="lg"
            {...form.register("password", {
              required: "စကားဝှက်ထည့်ပါ။",
              maxLength: { value: 64, message: "အများဆုံး 64 လုံးသာရမယ်။" },
            })}
          />

          <label className="flex items-center gap-2 text-sm text-default-600 select-none">
            <input
              className="h-4 w-4 accent-primary"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            စကားဝှက်ကိုပြမယ် (Show password)
          </label>
        </div>

        {/* Submit */}
        <Button
          className="w-full font-semibold text-base"
          color="primary"
          radius="lg"
          size="lg"
          isLoading={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
          type="submit"
          variant="shadow"
        >
          ဝင်မယ်
        </Button>

        {/* Footer */}
        <div className="pt-2 text-center text-xs text-default-500">
          © {new Date().getFullYear()} Outline Dashboard
        </div>
      </form>
    </div>
  );
}
