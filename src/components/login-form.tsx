"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Checkbox, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import { checkPassword, login } from "@/src/core/actions";
import { Logo, EyeIcon } from "@/src/components/icons";

interface FormProps {
    password: string;
}

export default function LoginForm() {
    const form = useForm<FormProps>();
    const [showPassword, setShowPassword] = useState(false);

    // ✅ splash/loading state (page open -> show logo+title)
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setBooting(false), 900); // short splash

        return () => clearTimeout(t);
    }, []);

    const actualSubmit = async (data: FormProps) => {
        const userId = await checkPassword(data.password);

        if (userId) {
            await login(userId);
        } else {
            form.setError("password", {
                type: "custom",
                message: "စကားဝှက်မမှန်ပါ။"
            });
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 overflow-hidden">
            {/* glass background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-400/10 blur-3xl rounded-full animate-pulse" />
            </div>

            {/* ✅ Splash screen */}
            <AnimatePresence>
                {booting && (
                    <motion.div
                        className="absolute inset-0 z-50 grid place-items-center bg-slate-950/80 backdrop-blur-md"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {/* glow ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                className="relative grid place-items-center w-24 h-24 rounded-3xl bg-white/5 border border-white/10"
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-purple-400/30 blur-xl" />
                                <Logo size={64} />
                            </motion.div>

                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                                    Outline Dashboard
                                </h1>
                                <p className="text-xs sm:text-sm text-white/60 mt-1">Loading...</p>
                            </div>

                            <Spinner color="primary" size="sm" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ✅ Main login card */}
            <motion.form
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="
          relative z-10 w-full max-w-sm
          bg-white/5 border border-white/10
          backdrop-blur-xl
          rounded-3xl shadow-2xl
          p-6 sm:p-8
          flex flex-col items-center gap-4 sm:gap-5
          text-white
        "
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onSubmit={form.handleSubmit(actualSubmit)}
            >
                {/* Header */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 mb-1"
                    initial={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    {/* ✅ floating + glowing logo */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        className="relative grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 shadow-inner"
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-400/25 via-cyan-400/20 to-purple-400/20 blur-lg" />
                        <Logo className="sm:scale-100 scale-95" size={52} />
                    </motion.div>

                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Outline Dashboard</h1>

                    {/* ✅ mobile font sizing */}
                    <p className="text-xs sm:text-sm text-white/70 text-center leading-relaxed px-2">
                        Server နဲ့ Access Key တွေကို အဆင်ပြေပြေ စီမံနိုင်ဖို့ Admin အဖြစ် ဝင်ရောက်ပါ
                    </p>
                </motion.div>

                {/* Password Input */}
                <div className="w-full grid gap-2">
                    <Input
                        className="w-full"
                        classNames={{
                            label: "text-white/80 text-sm sm:text-base",
                            inputWrapper:
                                "bg-white/5 border-white/10 hover:border-white/30 focus-within:border-emerald-400/70",
                            input: "text-white placeholder:text-white/40 text-sm sm:text-base",
                            errorMessage: "text-red-300 text-xs sm:text-sm"
                        }}
                        color="primary"
                        errorMessage={form.formState.errors.password?.message}
                        isInvalid={!!form.formState.errors.password}
                        label="Admin Password"
                        placeholder="••••••••"
                        radius="lg"
                        size="md"
                        type={showPassword ? "text" : "password"}
                        variant="bordered"
                        {...form.register("password", {
                            required: "စကားဝှက်ထည့်ပါ။",
                            maxLength: { value: 64, message: "အများဆုံး 64 လုံးသာရမယ်။" }
                        })}
                    />

                    {/* Show password toggle */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-white/70">
                        <Checkbox
                            classNames={{
                                label: "text-white/70",
                                wrapper: "before:border-white/40"
                            }}
                            isSelected={showPassword}
                            onValueChange={setShowPassword}
                        >
                            Show password
                        </Checkbox>

                        <div className="flex items-center gap-1">
                            <EyeIcon size={16} />
                            <span>{showPassword ? "Visible" : "Hidden"}</span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        className="
              w-full font-semibold
              text-sm sm:text-base
              bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
              shadow-lg shadow-emerald-500/25
              hover:shadow-cyan-500/30
              text-white
            "
                        isLoading={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                        radius="lg"
                        type="submit"
                        variant="shadow"
                    >
                        ဝင်မယ်
                    </Button>
                </motion.div>

                {/* Footer */}
                <div className="text-[10px] sm:text-xs text-white/50 mt-1 text-center">
                    © {new Date().getFullYear()} Outline Dashboard
                </div>
            </motion.form>
        </div>
    );
}
