"use client";

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Link,
    Pagination,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { AccessKey } from "@prisma/client";

import AccessKeyModal from "@/src/components/modals/access-key-modal";
import ConfirmModal from "@/src/components/modals/confirm-modal";
import { ArrowLeftIcon, PlusIcon } from "@/src/components/icons";
import AccessKeyServerInfo from "@/src/components/access-key-server-info";
import { getAccessKeys, removeAccessKey } from "@/src/core/actions/access-key";
import { ServerWithTags } from "@/src/core/definitions";
import AccessKeyValidityChip from "@/src/components/access-key-validity-chip";
import MessageModal from "@/src/components/modals/message-modal";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import { syncServer } from "@/src/core/actions/server";
import { PAGE_SIZE } from "@/src/core/config";
import AccessKeyDataUsageChip from "@/src/components/access-key-data-usage-chip";

interface Props {
    server: ServerWithTags;
    total: number;
}

export default function ServerAccessKeys({ server, total }: Props) {
    const accessKeyModalDisclosure = useDisclosure();
    const removeAccessKeyConfirmModalDisclosure = useDisclosure();
    const apiErrorModalDisclosure = useDisclosure();

    const totalPage = Math.ceil(total / PAGE_SIZE);

    const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
    const [serverError, setServerError] = useState<string>();
    const [formattedAccessKey, setFormattedAccessKey] = useState<string>();
    const [currentAccessKey, setCurrentAccessKey] = useState<AccessKey>();
    const [page, setPage] = useState<number>(1);

    // ✅ now used in UI
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleRemoveAccessKey = async () => {
        if (!currentAccessKey) return;
        try {
            await removeAccessKey(server.id, currentAccessKey.id, currentAccessKey.apiId);
            await updateData();
        } catch (error) {
            setServerError((error as object).toString());
            apiErrorModalDisclosure.onOpen();
        } finally {
            await syncServer(server);
        }
    };

    const updateData = async () => {
        setIsLoading(true);
        try {
            const data = await getAccessKeys(server.id, { skip: (page - 1) * PAGE_SIZE });
            setAccessKeys(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!currentAccessKey) return;

        let prefixUrlValue = "";

        if (currentAccessKey.prefix) {
            const prefix = AccessKeyPrefixes.find((x) => x.type === currentAccessKey.prefix);

            if (prefix) {
                if (currentAccessKey.accessUrl.endsWith("?outline=1")) {
                    prefixUrlValue = `&prefix=${prefix.urlEncodedValue}`;
                } else {
                    prefixUrlValue = `?prefix=${prefix.urlEncodedValue}`;
                }
            }
        }

        setFormattedAccessKey(
            `${currentAccessKey.accessUrl}${prefixUrlValue}#${encodeURIComponent(currentAccessKey.name)}`
        );
    }, [currentAccessKey]);

    useEffect(() => {
        updateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <>
            <AccessKeyModal disclosure={accessKeyModalDisclosure} value={formattedAccessKey} />

            {/* Error modal */}
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <span>Access Key ကို ဖျက်မရပါ။ တစ်ခုခုမှားယွင်းနေပါတယ်။</span>
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">
                            {serverError}
                        </pre>
                    </div>
                }
                disclosure={apiErrorModalDisclosure}
                title="Server အမှား!"
            />

            {/* Delete confirm */}
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>ဒီ Access Key ကို ဖျက်ချင်တာ သေချာပြီလား?</span>
                        <p className="text-default-500 text-sm whitespace-pre-wrap break-all">
                            {formattedAccessKey}
                        </p>
                    </div>
                }
                confirmLabel="ဖျက်မယ်"
                disclosure={removeAccessKeyConfirmModalDisclosure}
                title="Access Key ဖျက်မယ်"
                onConfirm={handleRemoveAccessKey}
            />

            <div className="grid gap-6">
                {/* Top bar */}
                <section className="flex justify-between items-center gap-2 flex-wrap">
                    <section className="flex items-center gap-2">
                        <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                            <Button as={Link} href="/servers" isIconOnly size="sm" variant="light">
                                <ArrowLeftIcon size={20} />
                            </Button>
                        </Tooltip>

                        <h1 className="text-xl font-semibold">{server.name}</h1>
                    </section>

                    <Button
                        as={Link}
                        color="primary"
                        href={`/servers/${server.id}/settings?return=/servers/${server.id}/access-keys`}
                        variant="light"
                    >
                        Settings
                    </Button>
                </section>

                {/* Server info */}
                <AccessKeyServerInfo numberOfKeys={accessKeys.length} server={server} />

                {/* Keys section */}
                <section className="grid gap-6">
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                        <h1 className="text-xl">🗝️ Access Keys</h1>

                        <Button
                            as={Link}
                            color="primary"
                            href={`/servers/${server.id}/access-keys/create`}
                            startContent={<PlusIcon size={20} />}
                            variant="shadow"
                        >
                            Key အသစ်လုပ်မယ်
                        </Button>
                    </div>

                    {/* ✅ Grid layout to avoid tablet overlap */}
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="w-full md:w-[400px] animate-pulse">
                                    <CardHeader>
                                        <div className="grid gap-2 w-full">
                                            <div className="h-4 w-2/3 bg-default-200 rounded-md" />
                                            <div className="h-3 w-1/2 bg-default-100 rounded-md" />
                                        </div>
                                    </CardHeader>
                                    <CardBody className="grid gap-3">
                                        {Array.from({ length: 4 }).map((__, j) => (
                                            <div key={j} className="h-3 bg-default-100 rounded-md" />
                                        ))}
                                    </CardBody>
                                    <CardFooter>
                                        <div className="h-8 w-full bg-default-200 rounded-md" />
                                    </CardFooter>
                                </Card>
                            ))
                        ) : accessKeys.length > 0 ? (
                            accessKeys.map((item) => (
                                <Card key={item.id} className="w-full md:w-[400px]">
                                    <CardHeader>
                                        <div className="grid gap-1">
                                            <span className="max-w-[360px] truncate font-medium">{item.name}</span>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="text-sm grid gap-2">
                                        <div className="flex gap-1 justify-between items-center">
                                            <span>ID</span>
                                            <Chip radius="sm" size="sm" variant="flat">
                                                {item.id}
                                            </Chip>
                                        </div>

                                        <div className="flex gap-1 justify-between items-center">
                                            <span>Data သုံးစွဲမှု</span>
                                            <AccessKeyDataUsageChip item={item} />
                                        </div>

                                        <div className="flex gap-1 justify-between items-center">
                                            <span>သက်တမ်း</span>
                                            <AccessKeyValidityChip value={item.expiresAt} />
                                        </div>

                                        <div className="flex gap-1 justify-between items-center">
                                            <span>Prefix</span>
                                            <Chip
                                                color={item.prefix ? "success" : "default"}
                                                radius="sm"
                                                size="sm"
                                                variant="flat"
                                            >
                                                {item.prefix ? item.prefix : "မရှိ"}
                                            </Chip>
                                        </div>
                                    </CardBody>

                                    <CardFooter>
                                        <ButtonGroup color="default" fullWidth size="sm" variant="flat">
                                            <Button
                                                onPress={() => {
                                                    setCurrentAccessKey(item);
                                                    accessKeyModalDisclosure.onOpen();
                                                }}
                                            >
                                                မျှဝေမယ်
                                            </Button>

                                            <Button as={Link} href={`/servers/${server.id}/access-keys/${item.id}/edit`}>
                                                ပြင်မယ်
                                            </Button>

                                            <Button
                                                color="danger"
                                                onPress={() => {
                                                    setCurrentAccessKey(item);
                                                    removeAccessKeyConfirmModalDisclosure.onOpen();
                                                }}
                                            >
                                                ဖျက်မယ်
                                            </Button>
                                        </ButtonGroup>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-sm text-foreground-500 py-10">
                                Access Key မရှိသေးပါ
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalPage > 1 && (
                        <div className="flex justify-center">
                            <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
