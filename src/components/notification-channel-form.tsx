"use client";

import React, { useState } from "react";
import { NotificationChannel } from "@prisma/client";
import { Radio, RadioGroup } from "@heroui/radio";
import { Controller, useForm } from "react-hook-form";
import { addToast, Alert, Button, Input, Link, Textarea, Tooltip, useDisclosure } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";
import {
    createNotificationChannel,
    testTelegramNotificationChannel,
    updateNotificationChannel
} from "@/src/core/actions/notification-channel";
import { getNotificationChannelTypes } from "@/src/core/utils";

interface Props {
    channel?: NotificationChannel;
}

type FormFields = {
    name: string;
    type: string;
    telegramApiUrl?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
    telegramMessageTemplate?: string;
};

export default function NotificationChannelForm({ channel }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const parsedConfig = (() => {
        if (!channel) {
            return {};
        }

        try {
            return channel.config ? JSON.parse(channel.config) : {};
        } catch {
            return {};
        }
    })();

    const form = useForm<FormFields>({
        defaultValues: {
            name: channel?.name,
            type: channel?.type,
            telegramApiUrl: parsedConfig.apiUrl ?? "",
            telegramBotToken: parsedConfig.botToken ?? "",
            telegramChatId: parsedConfig.chatId ?? "",
            telegramMessageTemplate: parsedConfig.messageTemplate ?? ""
        },
        shouldUnregister: false
    });

    const { register, handleSubmit, formState, watch, control, getValues } = form;

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isTesting, setIsTesting] = useState<boolean>(false);

    const selectedType = watch("type");

    const handleTest = async () => {
        const values = getValues();

        try {
            setIsTesting(true);
            const result = await testTelegramNotificationChannel({
                apiUrl: values.telegramApiUrl!,
                botToken: values.telegramBotToken!,
                chatId: values.telegramChatId!,
                messageTemplate: values.telegramMessageTemplate!
            });

            if (result.ok) {
                addToast({
                    title: "အောင်မြင်ပါတယ်",
                    description: result.message,
                    color: "success"
                });
            } else {
                setErrorMessage(result.message);
                errorModalDisclosure.onOpen();
            }
        } catch (error) {
            setErrorMessage((error as object).toString());
            errorModalDisclosure.onOpen();
        } finally {
            setIsTesting(false);
        }
    };

    const actualSubmit = async (data: FormFields) => {
        const type = data.type ?? "None";
        let config = null;

        if (data.type === "Telegram") {
            const messageTemplate = data.telegramMessageTemplate ?? "";

            config = JSON.stringify({
                apiUrl: data.telegramApiUrl!,
                botToken: data.telegramBotToken!,
                chatId: data.telegramChatId!,
                messageTemplate: messageTemplate.length > 0 ? messageTemplate : app.defaultTelegramNotificationTemplate
            });
        }

        try {
            if (channel) {
                await updateNotificationChannel({
                    id: channel.id,
                    type: type,
                    name: data.name,
                    config
                });
            } else {
                await createNotificationChannel({
                    type: type,
                    name: data.name,
                    config
                });
            }

            const returnUrl = searchParams.get("return");

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push("/notification-channels");
            }
        } catch (error) {
            setErrorMessage((error as object).toString());
            errorModalDisclosure.onOpen();
        }
    };

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{errorMessage}</pre>
                    </div>
                }
                disclosure={errorModalDisclosure}
                title="အမှား!"
            />

            <div className="grid gap-6 w-full">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Notification Channels" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/notification-channels" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">
                        {channel ? "Notification Channel ပြင်မယ်" : "Notification Channel အသစ် ထည့်မယ်"}
                    </h1>
                </section>

                <form className="w-full max-w-[464px] grid gap-4" onSubmit={handleSubmit(actualSubmit)}>
                    <Input
                        color="primary"
                        errorMessage={formState.errors.name?.message}
                        isInvalid={!!formState.errors.name}
                        label="Channel အမည်"
                        placeholder="ဥပမာ - My Telegram"
                        variant="underlined"
                        {...register("name", {
                            required: "Channel အမည်ထည့်ပါ"
                        })}
                    />

                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <RadioGroup
                                defaultValue={channel?.type ?? "None"}
                                label="Notification အမျိုးအစား"
                                value={field.value}
                                onChange={field.onChange}
                            >
                                {getNotificationChannelTypes().map((channel) => (
                                    <Radio key={channel} value={channel}>
                                        {channel}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    {/* Telegram settings */}
                    {selectedType === "Telegram" && (
                        <div className="grid gap-2">
                            <div className="text-sm text-foreground-500 flex justify-between gap-2 items-center">
                                <span>Configuration (သတ်မှတ်ချက်များ)</span>
                                <Button
                                    isDisabled={formState.isSubmitting || formState.isSubmitSuccessful}
                                    isLoading={isTesting}
                                    size="sm"
                                    variant="light"
                                    onPress={handleTest}
                                >
                                    စမ်းသပ်မယ်
                                </Button>
                            </div>

                            <div>
                                {selectedType === "Telegram" && (
                                    <Alert color="warning" variant="flat">
                                        သင့် Server တင်ထားတဲ့ Region မှာ Telegram ကို ပိတ်ထားတယ်ဆိုရင် Telegram API ကနေ
                                        Notification ပို့ရာမှာ အခက်အခဲရှိနိုင်ပါတယ်။ အဲ့ဒါ ဖြေရှင်းဖို့ Proxy
                                        တစ်ခုသုံးနိုင်ပါတယ် — ဥပမာ{" "}
                                        <Link
                                            className="text-warning font-black contents"
                                            href={app.links.myTelegramApiProxyWorkerRepo}
                                            target="_blank"
                                        >
                                            Cloudflare Worker နဲ့ Telegram API Proxy
                                        </Link>
                                        ။
                                    </Alert>
                                )}

                                <Input
                                    color="primary"
                                    defaultValue="https://api.telegram.org"
                                    errorMessage={formState.errors.telegramApiUrl?.message}
                                    isInvalid={!!formState.errors.telegramApiUrl}
                                    label="Telegram API URL"
                                    placeholder="ဥပမာ - https://api.telegram.org"
                                    variant="underlined"
                                    {...register("telegramApiUrl", {
                                        required: "API URL ထည့်ပါ",
                                        setValueAs: (v) => v?.replace(/\/+$/, "")
                                    })}
                                />
                            </div>

                            <Input
                                color="primary"
                                errorMessage={formState.errors.telegramBotToken?.message}
                                isInvalid={!!formState.errors.telegramBotToken}
                                label="Bot Token"
                                placeholder="ဥပမာ - 7049328752:AAE20ro04o0XApJ0yuesd12t5e8w41s55ck"
                                variant="underlined"
                                {...register("telegramBotToken", {
                                    required: "Bot token ထည့်ပါ"
                                })}
                            />

                            <Input
                                color="primary"
                                errorMessage={formState.errors.telegramChatId?.message}
                                isInvalid={!!formState.errors.telegramChatId}
                                label="Chat ID"
                                placeholder="ဥပမာ - 1234401001"
                                variant="underlined"
                                {...register("telegramChatId", { required: "Chat ID ထည့်ပါ" })}
                            />

                            <Textarea
                                color="primary"
                                description="အသုံးပြုလို့ရတဲ့ placeholders: {{serverName}} {{serverHostnameOrIp}} {{errorMessage}}"
                                errorMessage={formState.errors.telegramMessageTemplate?.message}
                                isInvalid={!!formState.errors.telegramMessageTemplate}
                                label="Message template (Markdown)"
                                placeholder={`ဥပမာ - ${app.defaultTelegramNotificationTemplate}`}
                                variant="underlined"
                                {...register("telegramMessageTemplate")}
                            />
                        </div>
                    )}

                    <Button
                        color="primary"
                        isDisabled={isTesting}
                        isLoading={formState.isSubmitting || formState.isSubmitSuccessful}
                        type="submit"
                        variant="shadow"
                    >
                        သိမ်းမယ်
                    </Button>
                </form>
            </div>
        </>
    );
}
