"use client";

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Input,
    Pagination,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicAccessKey } from "@prisma/client";
import { Link } from "@heroui/link";

import ConfirmModal from "@/src/components/modals/confirm-modal";
import { InfoIcon, PlusIcon, SelfManagedKeyIcon } from "@/src/components/icons";
import { DynamicAccessKeyWithAccessKeysCount } from "@/src/core/definitions";
import {
    getDynamicAccessKeys,
    getDynamicAccessKeysCount,
    removeDynamicAccessKey,
    resetDynamicAccessKeyUsage
} from "@/src/core/actions/dynamic-access-key";
import DynamicAccessKeyModal from "@/src/components/modals/dynamic-access-key-modal";
import { app, PAGE_SIZE } from "@/src/core/config";
import DynamicAccessKeyValidityChip from "@/src/components/dynamic-access-key-validity-chip";
import DynamicAccessKeysSslWarning from "@/src/components/dynamic-access-keys-ssl-warning";
import DynamicAccessKeyDataUsageChip from "@/src/components/dynamic-access-key-data-usage-chip";

interface SearchFormProps {
    term: string;
}

export default function DynamicAccessKeysList() {
    const [dynamicAccessKeys, setDynamicAccessKeys] = useState<DynamicAccessKeyWithAccessKeysCount[]>([]);
    const [currentDynamicAccessKey, setCurrentDynamicAccessKey] = useState<DynamicAccessKey>();
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

    const deleteConfirmModalDisclosure = useDisclosure();
    const resetConfirmModalDisclosure = useDisclosure();
    const dynamicAccessKeyModalDisclosure = useDisclosure();

    const searchForm = useForm<SearchFormProps>();

    const handleSearch = async (data: SearchFormProps) => {
        const params = { term: data.term };

        setIsLoading(true);
        try {
            const filtered = await getDynamicAccessKeys(params, true);
            const total = await getDynamicAccessKeysCount(params);

            setTotalItems(total);
            setDynamicAccessKeys(filtered);
            setPage(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentDynamicAccessKey) return;
        await removeDynamicAccessKey(currentDynamicAccessKey.id);
        await updateData();
    };

    const handleReset = async () => {
        if (!currentDynamicAccessKey) return;
        await resetDynamicAccessKeyUsage(currentDynamicAccessKey.id);
        await updateData();
    };

    const getCurrentAccessKeyUrl = () => {
        if (!currentDynamicAccessKey) return;

        const swappedProtocol = window.location.origin
            .replace("http://", "ssconf://")
            .replace("https://", "ssconf://");
        const name = encodeURIComponent(currentDynamicAccessKey.name);

        return `${swappedProtocol}/api/dak/${currentDynamicAccessKey.path}#${name}`;
    };

    const updateData = async () => {
        const params = {
            skip: (page - 1) * PAGE_SIZE,
            term: searchForm.getValues("term")
        };

        setIsLoading(true);
        try {
            const data = await getDynamicAccessKeys(params, true);
            setDynamicAccessKeys(data);

            const count = await getDynamicAccessKeysCount(params);
            setTotalItems(count);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <>
            {/* Share Modal */}
            <DynamicAccessKeyModal disclosure={dynamicAccessKeyModalDisclosure} value={getCurrentAccessKeyUrl()} />

            {/* Delete Confirm */}
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>ဒီ Dynamic Access Key ကို ဖျက်ချင်တာ သေချာလား?</span>
                        <p className="text-foreground-500 text-sm whitespace-pre-wrap break-all">
                            {getCurrentAccessKeyUrl()}
                        </p>
                    </div>
                }
                confirmLabel="ဖျက်မယ်"
                disclosure={deleteConfirmModalDisclosure}
                title="Dynamic Access Key ဖျက်မယ်"
                onConfirm={handleDelete}
            />

            {/* Reset Confirm */}
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>ဒီ Dynamic Access Key ကို Reset လုပ်ချင်တာ သေချာလား?</span>
                        <p className="text-foreground-500 text-sm whitespace-pre-wrap break-all">
                            ဒီလုပ်ဆောင်ချက်က Data Usage ကို 0 ပြန်ထားပြီး Usage Start Date ကိုလည်း ပြန်ဖျက်ပစ်ပါလိမ့်မယ်။
                        </p>
                    </div>
                }
                confirmLabel="Reset လုပ်မယ်"
                disclosure={resetConfirmModalDisclosure}
                title="Dynamic Access Key Reset"
                onConfirm={handleReset}
            />

            <div className="grid gap-4">
                {/* Title */}
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl font-semibold">Dynamic Access Keys</h1>

                    <Tooltip content="Dynamic Access Key အကြောင်း ဖတ်ရန်">
                        <Link href={app.links.outlineVpn.dynamicAccessKeys} target="_blank">
                            <InfoIcon size={20} />
                        </Link>
                    </Tooltip>
                </div>

                {/* SSL warning */}
                <DynamicAccessKeysSslWarning />

                {/* Search + Create */}
                <div className="flex justify-between items-center gap-2 flex-wrap">
                    <form onSubmit={searchForm.handleSubmit(handleSearch)}>
                        <Input
                            className="w-fit min-w-[220px]"
                            placeholder="နာမည်နဲ့ ရှာရန် [+Enter]"
                            startContent={<>🔍</>}
                            variant="faded"
                            {...searchForm.register("term")}
                        />
                    </form>

                    <Button
                        as={Link}
                        color="primary"
                        href="/dynamic-access-keys/create"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                    >
                        အသစ်လုပ်မယ်
                    </Button>
                </div>

                {/* List */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
                    {isLoading ? (
                        // ✅ Loading state
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="w-full md:w-[400px] animate-pulse">
                                <CardHeader>
                                    <div className="grid gap-2 w-full">
                                        <div className="h-4 w-2/3 bg-default-200 rounded-md" />
                                        <div className="h-3 w-1/2 bg-default-100 rounded-md" />
                                    </div>
                                </CardHeader>
                                <CardBody className="grid gap-3">
                                    {Array.from({ length: 5 }).map((__, j) => (
                                        <div key={j} className="h-3 bg-default-100 rounded-md" />
                                    ))}
                                </CardBody>
                                <CardFooter>
                                    <div className="h-8 w-full bg-default-200 rounded-md" />
                                </CardFooter>
                            </Card>
                        ))
                    ) : dynamicAccessKeys.length > 0 ? (
                        dynamicAccessKeys.map((item) => (
                            <Card key={item.id} className="w-full md:w-[400px]">
                                <CardHeader>
                                    <div className="grid gap-1">
                                        <span className="max-w-[360px] truncate font-medium">{item.name}</span>
                                        <span className="max-w-[360px] truncate text-foreground-400 text-sm">
                                            {item.path}
                                        </span>
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
                                        <span>စီမံခန့်ခွဲမှု အမျိုးအစား</span>
                                        {item.isSelfManaged ? (
                                            <Chip color="secondary" radius="sm" size="sm" variant="flat">
                                                Self-Managed
                                            </Chip>
                                        ) : (
                                            <Chip color="default" radius="sm" size="sm" variant="flat">
                                                Manual
                                            </Chip>
                                        )}
                                    </div>

                                    <div className="flex gap-1 justify-between items-center">
                                        <span>Data အသုံးပြုမှု</span>
                                        <DynamicAccessKeyDataUsageChip item={item} />
                                    </div>

                                    <div className="flex gap-1 justify-between items-center">
                                        <span>Key အရေအတွက်</span>
                                        <Chip
                                            color="default"
                                            radius="sm"
                                            size="sm"
                                            startContent={item.isSelfManaged && <SelfManagedKeyIcon size={18} />}
                                            variant="flat"
                                        >
                                            {item.isSelfManaged ? <span>Auto</span> : item._count?.accessKeys}
                                        </Chip>
                                    </div>

                                    <div className="flex gap-1 justify-between items-center">
                                        <span>Load Balancer</span>
                                        <Chip color="default" radius="sm" size="sm" variant="flat">
                                            {item.loadBalancerAlgorithm}
                                        </Chip>
                                    </div>

                                    <div className="flex gap-1 justify-between items-center">
                                        <span>Prefix</span>
                                        <Chip
                                            color={item.prefix ? "success" : "default"}
                                            radius="sm"
                                            size="sm"
                                            variant="flat"
                                        >
                                            {item.prefix ? item.prefix : "မရှိပါ"}
                                        </Chip>
                                    </div>

                                    <div className="flex gap-1 justify-between items-center">
                                        <span>သက်တမ်း (Validity)</span>
                                        <DynamicAccessKeyValidityChip dak={item} />
                                    </div>
                                </CardBody>

                                <CardFooter>
                                    <ButtonGroup color="default" fullWidth size="sm" variant="flat">
                                        <Button
                                            onPress={() => {
                                                setCurrentDynamicAccessKey(item);
                                                dynamicAccessKeyModalDisclosure.onOpen();
                                            }}
                                        >
                                            မျှဝေမယ်
                                        </Button>

                                        {item.isSelfManaged ? (
                                            <Button
                                                onPress={() => {
                                                    setCurrentDynamicAccessKey(item);
                                                    resetConfirmModalDisclosure.onOpen();
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        ) : (
                                            <Button as={Link} href={`/dynamic-access-keys/${item.id}/access-keys`}>
                                                Access Keys
                                            </Button>
                                        )}

                                        <Button as={Link} href={`/dynamic-access-keys/${item.id}/edit`}>
                                            ပြင်မယ်
                                        </Button>

                                        <Button
                                            color="danger"
                                            onPress={() => {
                                                setCurrentDynamicAccessKey(item);
                                                deleteConfirmModalDisclosure.onOpen();
                                            }}
                                        >
                                            ဖျက်မယ်
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        // ✅ No result
                        <div className="col-span-full text-center text-sm text-foreground-500 py-10">
                            Dynamic Access Key မရှိသေးပါ
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalPage > 1 && dynamicAccessKeys.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
                    </div>
                )}
            </div>
        </>
    );
}
