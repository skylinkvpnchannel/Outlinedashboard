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
    Link,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import ConfirmModal from "@/src/components/modals/confirm-modal";
import { PlusIcon } from "@/src/components/icons";
import { getServersWithTags, removeServer } from "@/src/core/actions/server";
import { ServerWithAccessKeysCountAndTags } from "@/src/core/definitions";
import { formatBytes } from "@/src/core/utils";
import { app } from "@/src/core/config";

interface Props {
    data: ServerWithAccessKeysCountAndTags[];
}

interface SearchFormProps {
    term: string;
}

export default function ServersList({ data }: Props) {
    const [servers, setServers] = useState<ServerWithAccessKeysCountAndTags[]>(data);
    const [serverToRemove, setServerToRemove] = useState<number | null>(null);
    const removeServerConfirmModalDisclosure = useDisclosure();

    const searchForm = useForm<SearchFormProps>();

    const handleSearch = async (data: SearchFormProps) => {
        const filteredServers = await getServersWithTags({ term: data.term }, true);

        setServers(filteredServers);
    };

    const handleRemoveServer = async () => {
        if (!serverToRemove) return;
        await removeServer(serverToRemove);
        // optional: refresh list after delete if you want
        // setServers((prev) => prev.filter((s) => s.id !== serverToRemove));
    };

    useEffect(() => {
        setServers(data);
    }, [data]);

    return (
        <>
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>ဒီ Server ကိုဖျက်ချင်တာ သေချာပြီလား?</span>
                        <p className="text-default-500 text-sm">
                            ဒီလုပ်ဆောင်ချက်က {app.name} ရဲ့ database ထဲကပဲ ဖျက်တာပါ။ Server ကိုကိုယ်တိုင်တော့ ထိခိုက်မှာ
                            မဟုတ်ပါဘူး။
                        </p>
                    </div>
                }
                confirmLabel="ဖျက်မယ်"
                disclosure={removeServerConfirmModalDisclosure}
                title="Server ဖျက်မယ်"
                onConfirm={handleRemoveServer}
            />

            <div className="grid gap-4">
                <h1 className="text-xl font-semibold">Servers</h1>

                <div className="flex justify-between items-center gap-2 flex-wrap">
                    <form onSubmit={searchForm.handleSubmit(handleSearch)}>
                        <Input
                            className="w-fit min-w-[220px]"
                            placeholder="နာမည်/Host ရိုက်ပြီး Enter နှိပ်ပါ"
                            startContent={<>🔍</>}
                            variant="faded"
                            {...searchForm.register("term")}
                        />
                    </form>

                    <Button
                        as={Link}
                        color="primary"
                        href="/servers/add"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                    >
                        Server အသစ်ထည့်မယ်
                    </Button>
                </div>

                {/* ✅ responsive grid */}
                <div
                    className="
                        grid gap-4
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-3
                        2xl:grid-cols-4
                    "
                >
                    {servers.map((item) => (
                        <Card
                            key={item.id}
                            className="
                                w-full min-w-0
                                rounded-2xl shadow-lg
                                bg-content1/90
                                border border-default-200/60
                            "
                        >
                            <CardHeader>
                                <div className="grid gap-1">
                                    <span className="truncate font-medium">{item.name}</span>
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
                                    <span>Host/IP</span>
                                    <Chip radius="sm" size="sm" variant="flat">
                                        {item.hostnameOrIp}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Key အသစ်များအတွက် Host/IP</span>
                                    <Chip radius="sm" size="sm" variant="flat">
                                        {item.hostnameForNewAccessKeys}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Key အသစ် Port</span>
                                    <Chip radius="sm" size="sm" variant="flat">
                                        {item.portForNewAccessKeys}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Keys အရေအတွက်</span>
                                    <Chip color="default" radius="sm" size="sm" variant="flat">
                                        {item._count?.accessKeys}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Data သုံးစွဲမှု စုစုပေါင်း</span>
                                    <Chip color="default" radius="sm" size="sm" variant="flat">
                                        {formatBytes(Number(item.totalDataUsage))}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Status</span>
                                    <Chip
                                        color={item.isAvailable ? "success" : "danger"}
                                        radius="sm"
                                        size="sm"
                                        variant="flat"
                                    >
                                        {item.isAvailable ? "အသင့်" : "မရနိုင်"}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Tags</span>

                                    {item.tags.length > 0 ? (
                                        <div className="flex gap-2 justify-end items-center flex-wrap">
                                            {item.tags.map((t) => (
                                                <Chip
                                                    key={t.tag.id}
                                                    color="default"
                                                    radius="sm"
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {t.tag.name}
                                                </Chip>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-foreground-400">မရှိသေးပါ</span>
                                    )}
                                </div>
                            </CardBody>

                            <CardFooter>
                                <ButtonGroup
                                    fullWidth
                                    className="!flex-nowrap"
                                    color="default"
                                    size="sm"
                                    variant="flat"
                                >
                                    <Button as={Link} href={`/servers/${item.id}/access-keys`}>
                                        Access Keys
                                    </Button>

                                    <Button as={Link} href={`/servers/${item.id}/settings`}>
                                        Settings
                                    </Button>

                                    <Button as={Link} href={`/servers/${item.id}/metrics`}>
                                        Metrics
                                    </Button>

                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            setServerToRemove(item.id);
                                            removeServerConfirmModalDisclosure.onOpen();
                                        }}
                                    >
                                        ဖျက်မယ်
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
