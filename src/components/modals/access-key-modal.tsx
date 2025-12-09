import { UseDisclosureReturn } from "@heroui/use-disclosure";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Snippet
} from "@heroui/react";
import React, { useEffect, useRef } from "react";

import { CopyIcon } from "@/src/components/icons";
import useQrCode from "@/src/hooks/use-qr-code";

interface Props {
    disclosure: UseDisclosureReturn;
    value: string | undefined;
}

export default function AccessKeyModal({ disclosure, value }: Props) {
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);
    const qrCode = useQrCode(qrCodeContainerRef);

    useEffect(() => {
        if (disclosure.isOpen) {
            qrCode(value);
        }
    }, [disclosure.isOpen, value]);

    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}
            placement="center"
            backdrop="blur"
            classNames={{
                base: "rounded-2xl shadow-2xl border border-default-200/60 bg-content1/95",
                header: "pb-2",
                body: "pt-2",
                footer: "pt-2"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-2">
                    <div className="text-2xl">🗝️</div>
                    <div className="grid">
                        <span className="text-lg font-semibold">Access Key</span>
                        <span className="text-xs text-default-500">
                            QR ကို Scan လုပ်ပြီး Key ကို ထည့်သုံးနိုင်ပါတယ်
                        </span>
                    </div>
                </ModalHeader>

                <ModalBody className="grid gap-4">
                    {/* QR */}
                    <div className="flex justify-center">
                        <div
                            className={[
                                "p-3 rounded-2xl bg-default-100/70 border border-default-200/60",
                                "shadow-sm backdrop-blur-md",
                                "transition-transform duration-200 hover:scale-[1.02]"
                            ].join(" ")}
                        >
                            <div
                                ref={qrCodeContainerRef}
                                className="rounded-xl overflow-hidden bg-white"
                            />
                        </div>
                    </div>

                    {/* Key Snippet */}
                    <div className="grid gap-1">
                        <span className="text-xs text-default-500">Access Key Link</span>
                        <Snippet
                            classNames={{
                                base: "!max-w-[280px] md:!max-w-[700px] bg-content2/70 border border-default-200/60 shadow-sm",
                                copyButton:
                                    "text-sm !min-w-6 !w-6 h-6 rounded-md bg-content1 hover:bg-content2 transition-colors",
                                pre: "!ps-1 truncate text-[12.5px]"
                            }}
                            copyIcon={<CopyIcon size={16} />}
                            hideSymbol={true}
                            variant="flat"
                        >
                            {value ?? "Key မရရှိသေးပါ"}
                        </Snippet>
                        <span className="text-[11px] text-default-400">
                            “Copy” ကိုနှိပ်ပြီး မျှဝေနိုင်ပါတယ်
                        </span>
                    </div>
                </ModalBody>

                <ModalFooter className="flex justify-end gap-2">
                    <Button
                        variant="light"
                        onPress={disclosure.onClose}
                        className="rounded-xl"
                    >
                        ပိတ်မယ်
                    </Button>
                    <Button
                        color="primary"
                        variant="shadow"
                        onPress={disclosure.onClose}
                        className="rounded-xl font-semibold"
                    >
                        အိုကေ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
