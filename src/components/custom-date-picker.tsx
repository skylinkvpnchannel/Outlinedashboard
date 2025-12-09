import { parseDate } from "@internationalized/date";
import { Button, CalendarDate, DatePicker } from "@heroui/react";
import React, { useRef, useState } from "react";
import { CalendarBoldIcon } from "@heroui/shared-icons";

import { getCurrentDateAsString } from "@/src/core/utils";

interface Props {
    value?: string;
    label?: string;
    onChange?: (value?: string) => void;
}

export default function CustomDatePicker({ label, value, onChange }: Props) {
    const triggerRef = useRef<any>();
    const [isHovered, setIsHovered] = useState(false);

    const openCalendar = () => {
        if (triggerRef.current) triggerRef.current.click();
    };

    const handleSelection = (v: CalendarDate | null) => {
        if (!onChange) return;

        if (v) {
            const month = String(v.month).padStart(2, "0");
            const day = String(v.day).padStart(2, "0");

            onChange(`${v.year}-${month}-${day}`);
        } else {
            onChange(undefined);
        }
    };

    return (
        <div className="grid w-full">
            {/* Hidden real DatePicker (logic same) */}
            <DatePicker
                aria-label="Access key သက်တမ်းကုန်ရက် ရွေးရန်"
                className="col-start-1 row-start-1 opacity-0 pointer-events-none"
                minValue={parseDate(getCurrentDateAsString())}
                radius="sm"
                selectorButtonProps={{ ref: triggerRef }}
                size="lg"
                value={value ? parseDate(value) : undefined}
                variant="faded"
                onChange={handleSelection}
            />

            {/* Pretty trigger button */}
            <Button
                fullWidth
                className={[
                    "col-start-1 row-start-1 text-sm w-full justify-between",
                    "transition-all duration-200 ease-out",
                    "bg-content2/70 hover:bg-content2",
                    "border border-default-200/60 hover:border-primary/40",
                    "shadow-sm hover:shadow-md",
                    "rounded-xl px-4",
                    isHovered ? "translate-y-[-1px]" : ""
                ].join(" ")}
                radius="sm"
                size="lg"
                startContent={
                    <span
                        className={[
                            "grid place-items-center rounded-lg p-2",
                            "bg-primary/10 text-primary",
                            "transition-transform duration-200",
                            isHovered ? "scale-105" : "scale-100"
                        ].join(" ")}
                    >
                        <CalendarBoldIcon height={18} width={18} />
                    </span>
                }
                variant="flat"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onPress={openCalendar}
            >
                <div className="flex flex-col items-start gap-0.5">
                    {label && <span className="text-default-500 text-xs">{label}</span>}
                    {value ? (
                        <span className="text-foreground font-medium tracking-wide">{value}</span>
                    ) : (
                        <span className="text-default-400">ရက်စွဲရွေးပါ (YYYY-MM-DD)</span>
                    )}
                </div>

                {/* Right side hint */}
                <span className="text-xs text-default-400">Calendar ဖွင့်ရန်</span>
            </Button>
        </div>
    );
}
