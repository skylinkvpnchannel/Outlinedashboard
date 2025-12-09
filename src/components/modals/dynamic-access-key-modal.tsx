"use client";

import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet } from "@heroui/react";
import React, { useEffect, useRef } from "react";

import { CopyIcon } from "@/src/components/icons";
import useQrCode from "@/src/hooks/use-qr-code";

interface Props {
    disclosure: UseDisclosureReturn;
    value: string | undefined;
}

export default function DynamicAccessKeyModal({ disclosure, value }: Props) {
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);
    const qrCode = useQrCode(qrCodeContainerRef);

    useEffect(() => {
        if (disclosure.isOpen) {
            qrCode(value);
        }
    }, [disclosure.isOpen, value, qrCode]);

    return (
        <Modal
            backdrop="blur"
            classNames={{
                base: "rounded-2xl shadow-2xl border border-default-200/60 bg-content1/95",
                header: "pb-2",
                body: "pt-2",
                footer: "pt-2"
            }}
            isOpen={disclosure.isOpen}
            placement="center"
            onOpenChange={disclosure.onOpenChange}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-2">
                    <div className="grid">
                        <div className="text-lg font-semibold">🗝️ Dynamic Access Key</div>
                        <div className="text-xs text-default-500">ဒီ key ကို QR နဲ့ Scan လုပ်ပြီး share လို့ရပါတယ်</div>
                    </div>
                </ModalHeader>

                <ModalBody className="grid gap-4">
                    <div className="flex justify-center">
                        <div
                            ref={qrCodeContainerRef}
                            className="rounded-2xl overflow-hidden bg-default-100 p-2 shadow-sm"
                        />
                    </div>

                    <Snippet
                        hideSymbol
                        classNames={{
                            base: "!max-w-[280px] md:!max-w-[700px] rounded-xl bg-default-50/60",
                            copyButton: "text-sm !min-w-6 !w-6 h-6 rounded-lg",
                            pre: "!ps-1 truncate"
                        }}
                        copyIcon={<CopyIcon size={16} />}
                        variant="flat"
                    >
                        {value ?? "—"}
                    </Snippet>

                    <p className="text-xs text-default-500 text-center">Copy လုပ်ပြီး Client app ထဲထည့်လို့ရပါတယ်</p>
                </ModalBody>

                <ModalFooter className="flex justify-end">
                    <Button className="rounded-xl font-semibold" variant="shadow" onPress={disclosure.onClose}>
                        အိုကေ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
