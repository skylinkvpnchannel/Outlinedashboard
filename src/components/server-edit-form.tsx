"use client";

import {
    Button,
    Checkbox,
    CheckboxGroup,
    Divider,
    Input,
    Link,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, { useState } from "react";
import { Tag } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeftIcon } from "@/src/components/icons";
import { EditServerRequest, ServerWithTags } from "@/src/core/definitions";
import { removeServer, updateServer } from "@/src/core/actions/server";
import ConfirmModal from "@/src/components/modals/confirm-modal";
import MessageModal from "@/src/components/modals/message-modal";
import { app } from "@/src/core/config";

interface Props {
    server: ServerWithTags;
    tags: Tag[];
}

export default function ServerEditForm({ server, tags }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("return");

    const updateErrorModalDisclosure = useDisclosure();
    const removeServerConfirmModalDisclosure = useDisclosure();

    const [serverError, setServerError] = useState<string>();

    const form = useForm<EditServerRequest>({
        defaultValues: {
            name: server.name,
            hostnameForNewAccessKeys: server.hostnameForNewAccessKeys,
            portForNewAccessKeys: server.portForNewAccessKeys,
            tags: server.tags.map((st) => st.tagId.toString())
        }
    });

    const actualSubmit = async (data: EditServerRequest) => {
        try {
            await updateServer(server.id, data);

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push("/servers");
            }
        } catch (error) {
            setServerError((error as object).toString());
            updateErrorModalDisclosure.onOpen();
        }
    };

    const handleRemoveServer = async () => {
        await removeServer(server.id);

        router.push("/servers");
    };

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <span>Server ကို မပြင်နိုင်ပါ။ တစ်ခုခုမှားယွင်းနေပါတယ်။</span>
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">
                            {serverError}
                        </pre>
                    </div>
                }
                disclosure={updateErrorModalDisclosure}
                title="Server အမှား!"
            />

            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>ဒီ Server ကို ဖျက်ချင်တာ သေချာပြီလား?</span>
                        <p className="text-default-500 text-sm">
                            ဒီလုပ်ဆောင်ချက်က {app.name} ရဲ့ database ထဲက ပဲ ဖျက်တာပါ။
                            Server ကိုကိုယ်တိုင်တော့ ထိခိုက်မှာ မဟုတ်ပါဘူး။
                        </p>
                    </div>
                }
                confirmLabel="ဖျက်မယ်"
                disclosure={removeServerConfirmModalDisclosure}
                title="Server ဖျက်မယ်"
                onConfirm={handleRemoveServer}
            />

            <div className="grid gap-6">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="နောက်သို့" delay={600} size="sm">
                        <Button
                            as={Link}
                            href={returnUrl ? returnUrl : "/servers"}
                            isIconOnly={true}
                            size="sm"
                            variant="light"
                        >
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">Server ဆက်တင်များ</h1>
                </section>

                <form className="p-2 grid gap-4" onSubmit={form.handleSubmit(actualSubmit)}>
                    <span className="text-lg">ပြင်လို့ရတဲ့ အချက်အလက်များ</span>

                    <Input
                        className="w-[320px]"
                        description="Server အတွက် နာမည်အသစ် သတ်မှတ်နိုင်ပါတယ်။ ဒီနာမည်က သုံးစွဲသူ device တွေအပေါ်မှာတော့ အလိုအလျောက် မပြောင်းသွားနိုင်ပါဘူး။"
                        isInvalid={!!form.formState.errors.name}
                        label="Server နာမည်"
                        required={true}
                        size="sm"
                        variant="underlined"
                        {...form.register("name", {
                            required: true,
                            maxLength: 128
                        })}
                    />

                    <Input
                        className="w-[320px]"
                        description="အခုရှိပြီးသား access keys တွေကို မထိခိုက်ပါဘူး။"
                        isInvalid={!!form.formState.errors.hostnameForNewAccessKeys}
                        label="Key အသစ်များအတွက် Hostname/IP"
                        required={true}
                        size="sm"
                        variant="underlined"
                        {...form.register("hostnameForNewAccessKeys", {
                            required: true,
                            maxLength: 128
                        })}
                    />

                    <Input
                        className="w-[320px]"
                        description="အခုရှိပြီးသား access keys တွေကို မထိခိုက်ပါဘူး။ သုံးမနေတဲ့ port ကို သေချာရွေးပါ။"
                        isInvalid={!!form.formState.errors.portForNewAccessKeys}
                        label="Key အသစ် Port (အများဆုံး 65535)"
                        required={true}
                        size="sm"
                        type="number"
                        variant="underlined"
                        {...form.register("portForNewAccessKeys", {
                            required: true,
                            min: 1,
                            max: 65535,
                            setValueAs: (v: string) => parseInt(v)
                        })}
                    />

                    <CheckboxGroup
                        label="Tags"
                        value={form.watch("tags")}
                        onChange={(values) => form.setValue("tags", values)}
                    >
                        {tags.map((tag) => (
                            <Checkbox key={tag.id} value={tag.id.toString()}>
                                {tag.name}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>

                    <Button
                        className="w-fit"
                        color="primary"
                        isLoading={form.formState.isSubmitting || (form.formState.isSubmitSuccessful && !serverError)}
                        type="submit"
                        variant="shadow"
                    >
                        သိမ်းမယ်
                    </Button>
                </form>

                <Divider />

                <div className="p-2 grid gap-4">
                    <span className="text-lg">Server ဖျက်မယ်</span>
                    <p className="text-default-500 text-sm">
                        ဒီလုပ်ဆောင်ချက်က {app.name}&apos;s database ထဲက ပဲ ဖျက်တာပါ။
                        Server ကိုကိုယ်တိုင်တော့ ထိခိုက်မှာ မဟုတ်ပါဘူး။
                    </p>

                    <Button
                        className="w-fit"
                        color="danger"
                        variant="shadow"
                        onPress={removeServerConfirmModalDisclosure.onOpen}
                    >
                        ဖျက်မယ်
                    </Button>
                </div>
            </div>
        </>
    );
}
