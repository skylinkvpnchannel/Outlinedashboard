import { Chip } from "@heroui/react";
import React from "react";
import { AccessKey } from "@prisma/client";

import { InfinityIcon } from "@/src/components/icons";
import { convertDataLimitToUnit, formatBytes } from "@/src/core/utils";
import { DataLimitUnit } from "@/src/core/definitions";

interface Props {
    item: AccessKey;
}

export default function AccessKeyDataUsageChip({ item }: Props) {
    const bytesPerMB = 1024 * 1024;
    const dataLimitInBytes = Number(item.dataLimit) * bytesPerMB;
    const isExceeded = item.dataLimit && item.dataUsage >= dataLimitInBytes;

    const usedText = formatBytes(Number(item.dataUsage));
    const limitText = item.dataLimit
        ? formatBytes(convertDataLimitToUnit(Number(item.dataLimit), DataLimitUnit.MB))
        : null;

    return (
        <Chip
            color={isExceeded ? "danger" : item.dataLimit ? "primary" : "default"}
            radius="sm"
            size="sm"
            variant="flat"
            className={[
                "px-2 py-1",
                "bg-content2/70 border border-default-200/60",
                "backdrop-blur-md",
                "transition-transform duration-200 hover:scale-[1.03]",
                isExceeded ? "shadow-sm shadow-danger/30" : "shadow-sm shadow-primary/20"
            ].join(" ")}
        >
            <div className="flex gap-2 items-center text-[12.5px] font-medium">
                {/* Used */}
                <span className="text-foreground">{usedText}</span>

                {/* of / total label */}
                <span className="text-default-500 text-[11px] font-semibold">
                    / စုစုပေါင်း
                </span>

                {/* Limit */}
                {limitText ? (
                    <span className="text-foreground">{limitText}</span>
                ) : (
                    <span className="flex items-center gap-1 text-foreground">
                        <InfinityIcon size={18} />
                        <span className="text-default-500 text-[11px] font-semibold">Limit မရှိ</span>
                    </span>
                )}

                {/* Exceeded badge */}
                {isExceeded && (
                    <span className="ml-1 text-[10px] font-bold text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded-md">
                        ကျော်လွန်
                    </span>
                )}
            </div>
        </Chip>
    );
}
