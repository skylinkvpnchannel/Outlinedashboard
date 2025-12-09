"use client";

import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { ReactNode } from "react";

interface Props {
    disclosure: UseDisclosureReturn;
    title?: string | ReactNode;
    body?: string | ReactNode;
    isDismissable?: boolean;
}

export default function MessageModal({ disclosure, title, body, isDismissable = false }: Props) {
    return (
        <Modal
            backdrop="blur"
            classNames={{
                base: "rounded-2xl shadow-2xl border border-default-200/60 bg-content1/95",
                header: "pb-2",
                body: "pt-2",
                footer: "pt-2"
            }}
            hideCloseButton={!isDismissable}
            isDismissable={isDismissable}
            isKeyboardDismissDisabled={!isDismissable}
            isOpen={disclosure.isOpen}
            placement="center"
            scrollBehavior="inside"
            onOpenChange={disclosure.onOpenChange}
        >
            <ModalContent>
                {title && (
                    <ModalHeader className="flex items-center gap-2">
                        <div className="grid">
                            <div className="text-lg font-semibold">{title}</div>
                            <div className="text-xs text-default-500">အချက်အလက်ကို သေချာဖတ်ပြီး အိုကေ နှိပ်ပါ</div>
                        </div>
                    </ModalHeader>
                )}

                {body && <ModalBody className="grid gap-3 text-sm">{body}</ModalBody>}

                <ModalFooter className="flex justify-end gap-2 mt-2">
                    <Button className="rounded-xl font-semibold" variant="shadow" onPress={disclosure.onClose}>
                        အိုကေ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
