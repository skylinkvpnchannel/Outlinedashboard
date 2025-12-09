import { Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";

import { InfinityIcon } from "@/src/components/icons";
import { formatAsDuration } from "@/src/core/utils";

interface Props {
    value: Date | null;
}

export default function AccessKeyValidityChip({ value }: Props) {
    const [duration, setDuration] = useState<string>("...");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDuration(formatAsDuration(new Date(), value ?? new Date()));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [value]);

    // မသတ်မှတ်ရသေး (Unlimited)
    if (!value) {
        return (
            <Chip
                color="success"
                radius="sm"
                size="sm"
                variant="flat"
                className="px-2 py-1 font-medium tracking-wide
                           bg-success-50 text-success-700
                           dark:bg-success/15 dark:text-success-300
                           animate-pulse"
                startContent={<InfinityIcon size={18} />}
            >
                အကန့်အသတ်မရှိ
            </Chip>
        );
    }

    // သက်တမ်းကုန်ပြီးသား
    if (value <= new Date()) {
        return (
            <Chip
                color="danger"
                radius="sm"
                size="sm"
                variant="flat"
                className="px-2 py-1 font-semibold tracking-wide
                           bg-danger-50 text-danger-700
                           dark:bg-danger/15 dark:text-danger-300
                           shadow-sm"
            >
                သက်တမ်းကုန်ပြီး
            </Chip>
        );
    }

    // သက်တမ်းကျန်နေသေး
    return (
        <Chip
            color="warning"
            radius="sm"
            size="sm"
            variant="flat"
            className="px-2 py-1 font-medium tracking-wide
                       bg-warning-50 text-warning-800
                       dark:bg-warning/15 dark:text-warning-300
                       shadow-sm"
        >
            ကျန်ချိန် {duration}
        </Chip>
    );
}
