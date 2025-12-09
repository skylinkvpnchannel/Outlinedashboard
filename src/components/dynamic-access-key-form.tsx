"use client";

import { DynamicAccessKey, Server, Tag } from "@prisma/client";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import moment from "moment";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Chip,
    cn,
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
import { Radio, RadioGroup } from "@heroui/radio";

import {
    AccessKeyPrefixType,
    EditDynamicAccessKeyRequest,
    LoadBalancerAlgorithm,
    NewDynamicAccessKeyRequest
} from "@/src/core/definitions";
import {
    createDynamicAccessKey,
    removeSelfManagedDynamicAccessKeyAccessKeys,
    syncDynamicAccessKeyAccessKeys,
    updateDynamicAccessKey
} from "@/src/core/actions/dynamic-access-key";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon, DeleteIcon } from "@/src/components/icons";
import CustomDatePicker from "@/src/components/custom-date-picker";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import { MAX_DATA_LIMIT_FOR_ACCESS_KEYS } from "@/src/core/config";

interface Props {
    servers: Server[];
    tags: Tag[];
    dynamicAccessKey?: DynamicAccessKey | null;
}

export default function DynamicAccessKeyForm({ dynamicAccessKey, tags, servers }: Props) {
    const router = useRouter();
    const form = useForm<NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest>({
        defaultValues: dynamicAccessKey
            ? {
                  name: dynamicAccessKey.name,
                  path: dynamicAccessKey.path,
                  loadBalancerAlgorithm: dynamicAccessKey.loadBalancerAlgorithm,
                  expiresAt: dynamicAccessKey.expiresAt,
                  prefix: dynamicAccessKey.prefix,
                  isSelfManaged: dynamicAccessKey.isSelfManaged,
                  serverPoolType: dynamicAccessKey.serverPoolType,
                  serverPoolValue: dynamicAccessKey.serverPoolValue
                      ? JSON.parse(dynamicAccessKey.serverPoolValue)
                      : null,
                  validityPeriod: dynamicAccessKey.validityPeriod ? dynamicAccessKey.validityPeriod : null,
                  dataLimit: dynamicAccessKey.dataLimit ? Number(dynamicAccessKey.dataLimit) : undefined
              }
            : {
                  name: "",
                  path: "",
                  loadBalancerAlgorithm: LoadBalancerAlgorithm.RandomKeyOnEachConnection,
                  expiresAt: null,
                  prefix: null,
                  isSelfManaged: false,
                  serverPoolType: null,
                  serverPoolValue: null,
                  validityPeriod: null,
                  dataLimit: null
              }
    });

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const [selectedExpirationDate, setSelectedExpirationDate] = useState<string>();
    const [selectedLoadBalancer, setSelectedLoadBalancer] = useState<string | null>(null);
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest) => {
        setErrorMessage(() => "");

        try {
            if (data.isSelfManaged) {
                if (Array.isArray(data.serverPoolValue)) {
                    data.serverPoolValue = JSON.stringify(data.serverPoolValue);
                }
            } else {
                data.serverPoolType = null;
                data.serverPoolValue = null;
            }

            data.loadBalancerAlgorithm ??= LoadBalancerAlgorithm.RandomKeyOnEachConnection;

            if (!data.path) {
                data.path = uuidv4();
            } else {
                data.path = slugify(data.path);
            }

            if (dynamicAccessKey) {
                const updateData = data as EditDynamicAccessKeyRequest;

                if (dynamicAccessKey.isSelfManaged) {
                    await removeSelfManagedDynamicAccessKeyAccessKeys(dynamicAccessKey.id);
                }

                updateData.id = dynamicAccessKey.id;
                await updateDynamicAccessKey(updateData);

                if (!dynamicAccessKey.isSelfManaged && updateData.isSelfManaged) {
                    await syncDynamicAccessKeyAccessKeys(dynamicAccessKey.id, []);
                }
            } else {
                await createDynamicAccessKey(data);
            }

            router.push("/dynamic-access-keys");
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
        if (selectedLoadBalancer) {
            form.setValue("loadBalancerAlgorithm", selectedLoadBalancer, { shouldDirty: true });
        } else {
            form.setValue("loadBalancerAlgorithm", LoadBalancerAlgorithm.RandomKeyOnEachConnection, {
                shouldDirty: true
            });
        }
    }, [selectedLoadBalancer]);

    useEffect(() => {
        form.setValue("prefix", selectedPrefix, { shouldDirty: true });
    }, [selectedPrefix]);

    useEffect(() => {
        if (dynamicAccessKey) {
            if (dynamicAccessKey.expiresAt) {
                setSelectedExpirationDate(moment(dynamicAccessKey.expiresAt).format("YYYY-MM-DD"));
            } else {
                setSelectedExpirationDate(undefined);
            }

            setSelectedLoadBalancer(dynamicAccessKey.loadBalancerAlgorithm);
            setSelectedPrefix(dynamicAccessKey.prefix);
        } else {
            setSelectedExpirationDate(undefined);
            setSelectedLoadBalancer(null);
            setSelectedPrefix(null);
        }
    }, [dynamicAccessKey]);

    const isSelfManaged = form.watch("isSelfManaged");
    const serverPoolType = form.watch("serverPoolType");
    const serverPoolValue = Array.from(form.watch("serverPoolValue") ?? []).map(String);

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

            <div className="grid gap-6 p-2">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Dynamic Access Keys" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/dynamic-access-keys" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">
                        {dynamicAccessKey
                            ? `Dynamic Access Key "${dynamicAccessKey.name}"`
                            : "Dynamic Access Key အသစ်ဖန်တီးရန်"}
                    </h1>
                </section>

                <form className="grid gap-4 w-full max-w-[464px]" onSubmit={form.handleSubmit(actualSubmit)}>
                    <Input
                        errorMessage={form.formState.errors.name?.message}
                        isInvalid={!!form.formState.errors.name}
                        label="Dynamic Access Key အမည်"
                        placeholder="ဥပမာ - My Dynamic Key"
                        size="sm"
                        variant="underlined"
                        {...form.register("name", {
                            required: "အမည်ထည့်ရန်လိုပါတယ်",
                            maxLength: {
                                value: 64,
                                message: "အမည်သည် အများဆုံး 64 လုံးသာရပါမယ်"
                            }
                        })}
                    />

                    <Input
                        description="မထည့်ပါက Path ကို စနစ်က အလိုအလျောက် ဖန်တီးပေးပါမယ်"
                        errorMessage={form.formState.errors.path?.message}
                        isInvalid={!!form.formState.errors.path}
                        label="Custom Path (မဖြစ်မနေမဟုတ်)"
                        placeholder="ဥပမာ - /dummy-dum-dummo"
                        size="sm"
                        variant="underlined"
                        {...form.register("path", {
                            required: false,
                            maxLength: {
                                value: 120,
                                message: "Path အမည်သည် အများဆုံး 120 လုံးသာရပါမယ်"
                            }
                        })}
                    />

                    {!selectedExpirationDate && (
                        <>
                            <Input
                                color="primary"
                                errorMessage={form.formState.errors.validityPeriod?.message}
                                isInvalid={!!form.formState.errors.validityPeriod}
                                label="သက်တမ်း (ရက်အလိုက်)"
                                placeholder="ဥပမာ - 30"
                                type="number"
                                variant="underlined"
                                {...form.register("validityPeriod", {
                                    max: {
                                        value: 10000,
                                        message: "တန်ဖိုးသည် 10000 ထက် မကြီးရပါ"
                                    },
                                    min: {
                                        value: 1,
                                        message: "တန်ဖိုးသည် 1 ထက် ကြီးရပါမယ်"
                                    }
                                })}
                            />

                            {!dynamicAccessKey && (
                                <RadioGroup
                                    defaultValue="now"
                                    label="အသုံးပြုမှု စတင်သတ်မှတ်မည့်ရက်"
                                    onValueChange={(v) => {
                                        form.setValue("setUsageDateOnFirstConnection", v === "first-connection");
                                    }}
                                >
                                    <Radio value="now">ဖန်တီးပြီးချင်း စတင်မယ်</Radio>
                                    <Radio value="first-connection">ပထမဆုံး ချိတ်ဆက်တဲ့အချိန်မှ စမယ်</Radio>
                                </RadioGroup>
                            )}
                        </>
                    )}

                    {selectedExpirationDate && (
                        <div className="flex gap-2">
                            <Button
                                aria-label="သက်တမ်းကုန်ရက် ဖျက်မယ်"
                                color="danger"
                                isIconOnly={true}
                                radius="sm"
                                size="lg"
                                variant="faded"
                                onPress={() => setSelectedExpirationDate(undefined)}
                            >
                                <DeleteIcon size={18} />
                            </Button>

                            <CustomDatePicker
                                label="သက်တမ်းကုန်ရက်:"
                                value={selectedExpirationDate}
                                onChange={(value) => setSelectedExpirationDate(value)}
                            />
                        </div>
                    )}

                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="bg-default-100 text-sm"
                                radius="sm"
                                size="lg"
                                type="button"
                                variant="ghost"
                            >
                                {selectedLoadBalancer
                                    ? `ရွေးထားတဲ့ Algo: ${selectedLoadBalancer}`
                                    : "Load Balancer Algorithm ရွေးပါ"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            defaultSelectedKeys={selectedLoadBalancer ? new Set([selectedLoadBalancer]) : undefined}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(v) => setSelectedLoadBalancer(v.currentKey!)}
                        >
                            <DropdownItem key={LoadBalancerAlgorithm.RandomKeyOnEachConnection}>
                                {LoadBalancerAlgorithm.RandomKeyOnEachConnection}
                            </DropdownItem>
                            <DropdownItem key={LoadBalancerAlgorithm.RandomServerKeyOnEachConnection}>
                                {LoadBalancerAlgorithm.RandomServerKeyOnEachConnection}
                            </DropdownItem>
                            <DropdownItem key={LoadBalancerAlgorithm.UserIpAddress}>
                                {LoadBalancerAlgorithm.UserIpAddress}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="bg-default-100 text-sm"
                                radius="sm"
                                size="lg"
                                type="button"
                                variant="ghost"
                            >
                                {selectedPrefix ? `ရွေးထားတဲ့ Prefix: ${selectedPrefix}` : "Prefix ရွေးပါ"}
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

                    {selectedPrefix && (
                        <div className="grid gap-2">
                            <Divider className="opacity-65" />
                            <span>ဒီ Prefix အတွက် အကြံပြု Port တွே —</span>
                            <div className="flex flex-wrap gap-2 rounded-xl p-4 bg-content2">
                                {AccessKeyPrefixes.find(
                                    (x) => x.type.toString() === selectedPrefix
                                )!.recommendedPorts.map((port) => (
                                    <Chip key={port.number} color="secondary" size="sm" variant="flat">
                                        {port.number} ({port.description})
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    )}

                    <RadioGroup
                        defaultValue={isSelfManaged ? "self-managed" : "manual"}
                        label="စီမံခန့်ခွဲမှု ပုံစံ"
                        onValueChange={(v) => form.setValue("isSelfManaged", v === "self-managed")}
                    >
                        <Radio value="manual">Manual (ကိုယ်တိုင်စီမံ)</Radio>
                        <Radio value="self-managed">Self-Managed (စနစ်က စီမံ)</Radio>
                    </RadioGroup>

                    <ul className="p-4 grid gap-2 rounded-xl bg-content2 text-foreground-500">
                        <li>
                            <strong className="text-warning">Manual:</strong> Access Key တွေကို ကိုယ်တိုင်ပဲ
                            ထည့်/ဖျက်/စီမံရပါမယ်။ Control အပြည့်ရပေမယ့် အလုပ်ပိုလုပ်ရပါတယ်။
                        </li>
                        <li>
                            <strong className="text-warning">Self-Managed:</strong> Server Pool ကို တစ်ခါတည်းသတ်မှတ်ပြီး
                            စနစ်က Access Key တွေကို အလိုအလျောက် စီမံပေးပါမယ်။ တစ်ခါထည့်ပြီးရင် လွယ်ကူပါတယ်။
                        </li>
                    </ul>

                    {isSelfManaged && (
                        <div className="grid gap-4">
                            <Divider />

                            <Input
                                endContent={<span>MB</span>}
                                errorMessage={form.formState.errors.dataLimit?.message}
                                isInvalid={!!form.formState.errors.dataLimit}
                                label="ဒေတာကန့်သတ်ချက်"
                                placeholder="ဥပမာ - 1024"
                                size="sm"
                                type="number"
                                variant="underlined"
                                {...form.register("dataLimit", {
                                    required: false,
                                    min: 1,
                                    max: {
                                        value: MAX_DATA_LIMIT_FOR_ACCESS_KEYS,
                                        message: `တန်ဖိုးသည် ${MAX_DATA_LIMIT_FOR_ACCESS_KEYS} ထက် မကြီးရပါ`
                                    },
                                    setValueAs: (v) => parseInt(v)
                                })}
                            />

                            <RadioGroup
                                defaultValue={serverPoolType}
                                label="Server Pool ပုံစံ"
                                onValueChange={(v) => {
                                    form.setValue("serverPoolType", v);
                                    form.setValue("serverPoolValue", null);
                                }}
                            >
                                <Radio value="manual">Manual (ကိုယ်တိုင်ရွေး)</Radio>
                                <Radio value="tag">Tag နဲ့ရွေး (အကြံပြု)</Radio>
                            </RadioGroup>

                            <ul className="p-4 grid gap-2 rounded-xl bg-content2 text-foreground-500">
                                <li>
                                    <strong className="text-warning">Manual:</strong> Pool ထဲထည့်မယ့် Server တွေကို
                                    ကိုယ်တိုင် ရွေးရပါမယ်။
                                </li>
                                <li>
                                    <strong className="text-warning">Tag (အကြံပြု):</strong> သတ်မှတ်ထားတဲ့ Tag တွေ ပါတဲ့
                                    Server တွေကို စနစ်က အလိုအလျောက် Pool ထဲထည့်ပေးပါမယ်။
                                </li>
                            </ul>

                            {serverPoolType === "manual" && (
                                <div className="grid gap-4">
                                    <Divider />

                                    <CheckboxGroup
                                        defaultValue={serverPoolValue}
                                        label="Pool ထဲထည့်မယ့် Server ကိုရွေးပါ"
                                        onValueChange={(values) => {
                                            const ids = values.map((x) => parseInt(x));

                                            form.setValue("serverPoolValue", JSON.stringify(ids));
                                        }}
                                    >
                                        {servers.map((server) => (
                                            <Checkbox
                                                key={server.id}
                                                aria-label={server.name}
                                                classNames={{
                                                    base: cn(
                                                        "ms-0.5 inline-flex w-full max-w-md bg-content1 mb-1",
                                                        "hover:bg-content2 items-center justify-start",
                                                        "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                                                        "data-[selected=true]:border-primary"
                                                    ),
                                                    label: "w-full"
                                                }}
                                                value={String(server.id)}
                                            >
                                                <div className="grid gap-2">
                                                    <span className="text-sm">{server.name}</span>
                                                    <div className="flex justify-between items-center gap-2">
                                                        <Chip size="sm" variant="flat">
                                                            {server.hostnameOrIp}
                                                        </Chip>
                                                        <Chip
                                                            color={server.isAvailable ? "success" : "danger"}
                                                            size="sm"
                                                            variant="flat"
                                                        >
                                                            {server.isAvailable ? "ရရှိနိုင်" : "မရရှိနိုင်"}
                                                        </Chip>
                                                    </div>
                                                </div>
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                </div>
                            )}

                            {serverPoolType === "tag" && (
                                <div className="grid gap-4">
                                    <Divider />

                                    <CheckboxGroup
                                        defaultValue={serverPoolValue}
                                        label="Pool အတွက် Tag ရွေးပါ"
                                        onValueChange={(values) => {
                                            const ids = values.map((x) => parseInt(x));

                                            form.setValue("serverPoolValue", JSON.stringify(ids));
                                        }}
                                    >
                                        {tags.map((tag) => (
                                            <Checkbox key={tag.id} value={String(tag.id)}>
                                                {tag.name}
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                </div>
                            )}
                        </div>
                    )}

                    <Button
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
