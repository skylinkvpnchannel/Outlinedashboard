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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        className="w-full max-w-sm bg-content1 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4"
        onSubmit={form.handleSubmit(actualSubmit)}
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <Logo size={72} />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Outline Admin Dashboard
          </h1>
          <p className="text-sm text-default-600 text-center">
            Server နဲ့ Access Key တွေ စီမံရန် ဝင်ရောက်ပါ
          </p>
        </div>

        <Input
          className="w-full"
          color="primary"
          errorMessage={form.formState.errors.password?.message}
          isInvalid={!!form.formState.errors.password}
          label="Admin Password"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          variant="underlined"
          {...form.register("password", {
            required: "စကားဝှက်ထည့်ပါ။",
            maxLength: { value: 64, message: "အများဆုံး 64 လုံးသာရမယ်။" },
          })}
        />

        <label className="w-full flex items-center gap-2 text-sm text-default-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>

        <Button
          className="w-full font-semibold"
          color="primary"
          isLoading={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
          type="submit"
          variant="shadow"
        >
          ဝင်မယ်
        </Button>

        <p className="text-xs text-default-500 mt-2 text-center">
          © {new Date().getFullYear()} Outline Admin
        </p>
      </form>
    </div>
  );
}
