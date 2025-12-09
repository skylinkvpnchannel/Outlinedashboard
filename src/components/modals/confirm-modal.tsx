"use client";

import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { ReactNode, useState } from "react";

interface Props {
    disclosure: UseDisclosureReturn;
    title?: string | ReactNode;
    body?: string | ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    isDismissable?: boolean;
    onConfirm?: CallableFunction;
    confirmColor?: "danger" | "primary" | "secondary" | "success" | "warning" | "default";
}

export default function ConfirmModal({
    disclosure,
    title,
    body,
    isDismissable = false,
    confirmLabel,
    cancelLabel = "မလုပ်တော့ဘူး",
    onConfirm = () => {},
    confirmColor = "danger"
}: Props) {
    const [isPerformingIntendedAction, setIsPerformingIntendedAction] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsPerformingIntendedAction(true);
            await onConfirm();
            disclosure.onClose();
        } finally {
            setIsPerformingIntendedAction(false);
        }
    };

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
            onOpenChange={disclosure.onOpenChange}
        >
            <ModalContent>
                {title && (
                    <ModalHeader className="flex items-center gap-2">
                        <div className="grid">
                            <div className="text-lg font-semibold">{title}</div>
                            <div className="text-xs text-default-500">အတည်ပြုရန် လိုပါသည်</div>
                        </div>
                    </ModalHeader>
                )}

                {body && <ModalBody className="text-sm text-foreground-600 grid gap-2">{body}</ModalBody>}

                <ModalFooter className="flex justify-end gap-2 mt-4">
                    <Button
                        className="rounded-xl"
                        isDisabled={isPerformingIntendedAction}
                        variant="light"
                        onPress={disclosure.onClose}
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        className="rounded-xl font-semibold"
                        color={confirmColor}
                        isLoading={isPerformingIntendedAction}
                        variant="shadow"
                        onPress={handleConfirm}
                    >
                        {confirmLabel ?? "အိုကေ"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
