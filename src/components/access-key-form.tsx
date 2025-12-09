"use client";

import { AccessKey } from "@prisma/client";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    Button,
    Chip,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Link,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { AccessKeyPrefixType, DataLimitUnit, EditAccessKeyRequest, NewAccessKeyRequest } from "@/src/core/definitions";
import { createAccessKey, updateAccessKey } from "@/src/core/actions/access-key";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon, DeleteIcon } from "@/src/components/icons";
import CustomDatePicker from "@/src/components/custom-date-picker";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import { syncServer } from "@/src/core/actions/server";
import { MAX_DATA_LIMIT_FOR_ACCESS_KEYS } from "@/src/core/config";

interface Props {
    serverId: number;
    accessKeyData?: AccessKey | null;
}

export default function AccessKeyForm({ serverId, accessKeyData }: Props) {
    const router = useRouter();
    const form = useForm<NewAccessKeyRequest | EditAccessKeyRequest>({
        defaultValues: accessKeyData
            ? {
                  serverId: accessKeyData.serverId,
                  name: accessKeyData.name,
                  dataLimit: accessKeyData.dataLimit ? Number(accessKeyData.dataLimit) : undefined,
                  expiresAt: accessKeyData.expiresAt,
                  prefix: accessKeyData.prefix
              }
            : {
                  serverId: serverId,
                  name: "",
                  dataLimit: null,
                  expiresAt: null,
                  prefix: null
              }
    });

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const [selectedExpirationDate, setSelectedExpirationDate] = useState<string>();
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewAccessKeyRequest | EditAccessKeyRequest) => {
        setErrorMessage(() => "");

        try {
            data.serverId ??= serverId;
            data.dataLimitUnit = DataLimitUnit.MB;

            if (accessKeyData) {
                const updateData = data as EditAccessKeyRequest;

                updateData.id = accessKeyData.id;
                await updateAccessKey(updateData);
            } else {
                await createAccessKey(data);
            }

            await syncServer(serverId);
            router.push(`/servers/${serverId}/access-keys`);
        } catch (error) {
            setErrorMessage(() => (error as object).toString());
        }
    };

    useEffect(() => {
        let value = null;

        if (selectedExpirationDate) {
            value = moment(selectedExpirationDate, "YYYY-MM-DD").toDate();
        }

        form.setValue("expiresAt", value, { shouldDirty: true });
    }, [selectedExpirationDate]);

    useEffect(() => {
        form.setValue("prefix", selectedPrefix, { shouldDirty: true });
    }, [selectedPrefix]);

    useEffect(() => {
        if (accessKeyData) {
            if (accessKeyData.expiresAt) {
                setSelectedExpirationDate(moment(accessKeyData.expiresAt).format("YYYY-MM-DD"));
            } else {
                setSelectedExpirationDate(undefined);
            }

            setSelectedPrefix(accessKeyData.prefix);
        } else {
            setSelectedExpirationDate(undefined);
            setSelectedPrefix(null);
        }
    }, [accessKeyData]);

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <span className="text-sm text-default-600">တစ်ခုခုမှားသွားပါတယ်</span>
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{errorMessage}</pre>
                    </div>
                }
                disclosure={errorModalDisclosure}
                title="Error!"
            />

            <div className="grid gap-6">
                {/* Header */}
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Access keys" delay={600} size="sm">
                        <Button
                            isIconOnly
                            as={Link}
                            className="rounded-full hover:bg-content2 transition"
                            href={`/servers/${serverId}/access-keys`}
                            size="sm"
                            variant="light"
                        >
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl font-semibold tracking-tight">
                        {accessKeyData ? `Access Key "${accessKeyData.name}"` : "Access Key အသစ်ထည့်မယ်"}
                    </h1>
                </section>

                {/* Form Card */}
                <form
                    className="
                        grid gap-5 w-full max-w-[520px]
                        rounded-2xl border border-default-200/60 bg-content1/80
                        backdrop-blur-md p-4 md:p-6 shadow-sm
                    "
                    onSubmit={form.handleSubmit(actualSubmit)}
                >
                    {/* Name */}
                    <Input
                        classNames={{
                            inputWrapper: "transition focus-within:scale-[1.01]"
                        }}
                        errorMessage={form.formState.errors.name?.message}
                        isInvalid={!!form.formState.errors.name}
                        label="Key နာမည်"
                        placeholder="ဥပမာ: My Key 1"
                        size="sm"
                        variant="underlined"
                        {...form.register("name", {
                            required: "နာမည်ထည့်ပေးပါ",
                            maxLength: {
                                value: 64,
                                message: "အများဆုံး 64 လုံးသာရမယ်"
                            }
                        })}
                    />

                    {/* Data Limit */}
                    <Input
                        classNames={{
                            inputWrapper: "transition focus-within:scale-[1.01]"
                        }}
                        description="မထည့်ထားရင် Limit မရှိပါ"
                        endContent={<span className="text-default-500 text-xs font-semibold">MB</span>}
                        errorMessage={form.formState.errors.dataLimit?.message}
                        isInvalid={!!form.formState.errors.dataLimit}
                        label="Data Limit (ရွေးချယ်နိုင်)"
                        placeholder="ဥပမာ: 1024"
                        size="sm"
                        type="number"
                        variant="underlined"
                        {...form.register("dataLimit", {
                            required: false,
                            min: 0,
                            max: {
                                value: MAX_DATA_LIMIT_FOR_ACCESS_KEYS,
                                message: `အများဆုံး ${MAX_DATA_LIMIT_FOR_ACCESS_KEYS} MB ထိသာရမယ်`
                            },
                            setValueAs: (v) => parseInt(v)
                        })}
                    />

                    {/* Expiration Date */}
                    <div className="flex gap-2 items-end">
                        {selectedExpirationDate && (
                            <Button
                                isIconOnly
                                className="shrink-0 hover:scale-105 transition"
                                color="danger"
                                radius="sm"
                                size="lg"
                                variant="faded"
                                onPress={() => setSelectedExpirationDate(undefined)}
                            >
                                <DeleteIcon size={18} />
                            </Button>
                        )}

                        <CustomDatePicker
                            label="သက်တမ်းကုန်မည့်နေ့"
                            value={selectedExpirationDate}
                            onChange={(value) => setSelectedExpirationDate(value)}
                        />
                    </div>

                    {/* Prefix Dropdown */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                fullWidth
                                className="
                                    bg-default-100/70 border border-default-200/60 text-sm
                                    rounded-xl justify-between
                                    hover:bg-content2 transition
                                "
                                radius="sm"
                                size="lg"
                                type="button"
                                variant="ghost"
                            >
                                {selectedPrefix ? `Prefix: ${selectedPrefix}` : "Prefix ရွေးရန်"}
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                            defaultSelectedKeys={selectedPrefix ? new Set([selectedPrefix]) : undefined}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(v) => setSelectedPrefix(v.currentKey!)}
                        >
                            {AccessKeyPrefixes.map((prefix) => (
                                <DropdownItem key={prefix.type === AccessKeyPrefixType.None ? "" : prefix.type}>
                                    {prefix.type}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {/* Recommended Ports */}
                    {selectedPrefix && (
                        <div className="grid gap-2">
                            <Divider className="opacity-60" />
                            <span className="text-sm text-default-600 font-medium">
                                Prefix အတွက် သင့်လျော်သော Port များ
                            </span>

                            <div className="flex flex-wrap gap-2 rounded-xl p-3 bg-content2/70 border border-default-200/60">
                                {AccessKeyPrefixes.find(
                                    (x) => x.type.toString() === selectedPrefix
                                )!.recommendedPorts.map((port) => (
                                    <Chip
                                        key={port.number}
                                        className="font-medium"
                                        color="secondary"
                                        size="sm"
                                        variant="flat"
                                    >
                                        {port.number} ({port.description})
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <Button
                        className="rounded-xl font-semibold tracking-wide hover:scale-[1.01] transition"
                        color="primary"
                        isLoading={!errorMessage && (form.formState.isSubmitting || form.formState.isSubmitSuccessful)}
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
