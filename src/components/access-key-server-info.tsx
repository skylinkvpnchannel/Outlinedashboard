import { Chip, Snippet, Tooltip } from "@heroui/react";
import React from "react";
import moment from "moment";

import { CopyIcon } from "@/src/components/icons";
import { formatBytes } from "@/src/core/utils";
import { ServerWithTags } from "@/src/core/definitions";

interface Props {
    server: ServerWithTags;
    numberOfKeys: number;
}

export default function AccessKeyServerInfo({ server, numberOfKeys }: Props) {
    const isUp = server.isAvailable;

    return (
        <section
            className="
                rounded-2xl border border-default-200/60 bg-content1/80
                backdrop-blur-md p-4 md:p-5
                grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3
                shadow-sm
            "
        >
            {/* Host/IP */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Host / IP
                </span>

                <Snippet
                    classNames={{
                        base:
                            "!max-w-[300px] bg-default-100/70 border border-default-200/60 " +
                            "rounded-lg transition hover:scale-[1.01]",
                        copyButton:
                            "text-sm !min-w-7 !w-7 h-7 rounded-md " +
                            "bg-content2 hover:bg-content3 transition",
                        pre: "!ps-1 truncate text-foreground font-medium"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol
                    size="sm"
                    variant="flat"
                >
                    {server.hostnameOrIp}
                </Snippet>
            </div>

            {/* Port */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Port
                </span>

                <Snippet
                    classNames={{
                        base:
                            "!max-w-[200px] bg-default-100/70 border border-default-200/60 " +
                            "rounded-lg transition hover:scale-[1.01]",
                        copyButton:
                            "text-sm !min-w-7 !w-7 h-7 rounded-md " +
                            "bg-content2 hover:bg-content3 transition",
                        pre: "!ps-1 truncate text-foreground font-medium"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol
                    size="sm"
                    variant="flat"
                >
                    {server.portForNewAccessKeys}
                </Snippet>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    အခြေအနေ
                </span>

                <Chip
                    color={isUp ? "success" : "danger"}
                    radius="sm"
                    size="sm"
                    variant="flat"
                    className={
                        "font-semibold tracking-wide " +
                        (isUp
                            ? "bg-success-50 text-success-700 dark:bg-success/15 dark:text-success-300"
                            : "bg-danger-50 text-danger-700 dark:bg-danger/15 dark:text-danger-300")
                    }
                >
                    {isUp ? "Online" : "Offline"}
                </Chip>
            </div>

            {/* Version */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Version
                </span>

                <Chip
                    radius="sm"
                    size="sm"
                    variant="flat"
                    className="bg-default-100/70 border border-default-200/60 font-medium"
                >
                    {server.version}
                </Chip>
            </div>

            {/* Number of keys */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Key အရေအတွက်
                </span>

                <Chip
                    radius="sm"
                    size="sm"
                    variant="flat"
                    className="bg-default-100/70 border border-default-200/60 font-semibold"
                >
                    {numberOfKeys}
                </Chip>
            </div>

            {/* Total usage */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    အသုံးပြုမှု စုစုပေါင်း
                </span>

                <Chip
                    radius="sm"
                    size="sm"
                    variant="flat"
                    className="bg-default-100/70 border border-default-200/60 font-semibold"
                >
                    {formatBytes(Number(server.totalDataUsage))}
                </Chip>
            </div>

            {/* Creation date */}
            <div className="flex justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    ဖန်တီးထားသည့်နေ့
                </span>

                <Tooltip closeDelay={200} content={moment(server.apiCreatedAt).fromNow()} delay={600} size="sm">
                    <Chip
                        radius="sm"
                        size="sm"
                        variant="flat"
                        className="bg-default-100/70 border border-default-200/60 font-medium cursor-help"
                    >
                        {moment(server.apiCreatedAt).format("YYYY-MM-DD HH:mm:ss")}
                    </Chip>
                </Tooltip>
            </div>

            {/* Management URL */}
            <div className="flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Management URL
                </span>

                <Snippet
                    classNames={{
                        base:
                            "!max-w-[280px] md:!max-w-[300px] bg-default-100/70 border border-default-200/60 " +
                            "rounded-lg transition hover:scale-[1.01]",
                        copyButton:
                            "text-sm !min-w-7 !w-7 h-7 rounded-md " +
                            "bg-content2 hover:bg-content3 transition",
                        pre: "!ps-1 truncate text-foreground font-medium"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol
                    size="sm"
                    title={server.apiUrl}
                    variant="flat"
                >
                    {server.apiUrl}
                </Snippet>
            </div>

            {/* Management JSON */}
            <div className="flex flex-wrap justify-between items-center gap-3 md:col-span-2">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Management JSON
                </span>

                <Snippet
                    classNames={{
                        base:
                            "!max-w-[280px] md:!max-w-[700px] bg-default-100/70 border border-default-200/60 " +
                            "rounded-lg transition hover:scale-[1.01]",
                        copyButton:
                            "text-sm !min-w-7 !w-7 h-7 rounded-md " +
                            "bg-content2 hover:bg-content3 transition",
                        pre: "!ps-1 truncate text-foreground font-medium"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol
                    size="sm"
                    title={server.managementJson}
                    variant="flat"
                >
                    {server.managementJson}
                </Snippet>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-between items-center gap-3 md:col-span-2">
                <span className="text-xs md:text-sm text-default-500 font-medium">
                    Tags
                </span>

                {server.tags.length > 0 ? (
                    <div className="flex gap-2 justify-end items-center flex-wrap">
                        {server.tags.map((t) => (
                            <Chip
                                key={t.tag.id}
                                color="default"
                                radius="sm"
                                size="sm"
                                variant="flat"
                                className="
                                    bg-content2/70 border border-default-200/60
                                    hover:bg-content3 transition
                                    font-medium
                                "
                            >
                                #{t.tag.name}
                            </Chip>
                        ))}
                    </div>
                ) : (
                    <span className="text-foreground-400 text-sm">Tag မရှိသေးပါ</span>
                )}
            </div>
        </section>
    );
}
