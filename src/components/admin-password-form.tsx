"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import React, { useState } from "react";

import { UserPasswordIcon } from "@/src/components/icons";
import { updatePassword } from "@/src/core/actions";

interface FormProps {
    password: string;
}

export default function AdminPasswordForm() {
    const router = useRouter();
    const form = useForm<FormProps>();
    const [showPassword, setShowPassword] = useState(false);

    const actualSubmit = async (data: FormProps) => {
        await updatePassword(data.password);
        router.push("/");
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <form
                className="w-full max-w-md bg-content1/90 backdrop-blur rounded-2xl shadow-xl p-8
                           grid gap-5 border border-default-200/60"
                onSubmit={form.handleSubmit(actualSubmit)}
            >
                {/* Header */}
                <div className="grid place-items-center gap-3 text-center">
                    <div
                        className="grid place-items-center rounded-2xl p-4
                                   bg-primary/10 text-primary shadow-sm"
                    >
                        <UserPasswordIcon size={92} />
                    </div>

                    <div className="grid gap-1">
                        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                            Admin စကားဝှက် သတ်မှတ်ရန်
                        </h1>
                        <p className="text-sm text-default-500 leading-relaxed">
                            Dashboard ကို စီမံခန့်ခွဲရန် Admin အတွက် စကားဝှက်အသစ်တစ်ခု သတ်မှတ်ပါ။
                        </p>
                    </div>
                </div>

                {/* Password input */}
                <Input
                    className="w-full"
                    color="primary"
                    errorMessage={form.formState.errors.password?.message}
                    isInvalid={!!form.formState.errors.password}
                    label="Admin စကားဝှက်"
                    placeholder="စကားဝှက်အသစ် ထည့်ပါ"
                    type={showPassword ? "text" : "password"}
                    variant="underlined"
                    {...form.register("password", {
                        required: "စကားဝှက် ထည့်ပါ။",
                        maxLength: { value: 64, message: "အများဆုံး 64 လုံးသာရမယ်။" }
                    })}
                />

                {/* Show password toggle */}
                <label className="flex items-center gap-2 text-sm text-default-600 select-none">
                    <input
                        checked={showPassword}
                        className="accent-primary"
                        type="checkbox"
                        onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    စကားဝှက်ကို မြင်အောင်ပြမယ်
                </label>

                {/* Action button */}
                <Button
                    className="w-full font-semibold tracking-wide"
                    color="primary"
                    isLoading={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                    type="submit"
                    variant="shadow"
                >
                    သိမ်းမယ်
                </Button>

                {/* Footer hint */}
                <p className="text-xs text-default-400 text-center pt-1">စကားဝှက်ကို မေ့မရအောင် မှတ်ထားပါနော်။</p>
            </form>
        </div>
    );
}
