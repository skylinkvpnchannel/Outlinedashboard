"use client";

import { Alert, Button, Card, CardBody, CardHeader, Chip, Divider, Link, Skeleton, Tooltip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Server } from "@prisma/client";
import { range } from "@heroui/shared-utils";

import { ArrowLeftIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";
import { Outline } from "@/src/core/definitions";
import { getServerMetrics } from "@/src/core/actions/server";
import { countryCodeToFlag, formatAdaptiveTime, formatBytes, formatTimestamp } from "@/src/core/utils";

interface Props {
    server: Server;
}

export default function ServerMetrics({ server }: Props) {
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("return");

    const [metrics, setMetrics] = useState<Outline.Experimental.Metrics | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadMetrics = async (quietly: boolean = false) => {
        if (quietly) {
            setMetrics(await getServerMetrics(server));
        } else {
            setIsLoading(true);

            setMetrics(await getServerMetrics(server));

            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();

        const refreshInterval = setInterval(() => loadMetrics(true), 10000);

        return () => clearInterval(refreshInterval);
    }, []);

    const hasNoData = !isLoading && !metrics;

    return (
        <>
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

                    <h1 className="text-xl break-word">
                        {server.name} ({server.hostnameOrIp}) မက်ထရစ်များ
                    </h1>
                </section>

                <section className="grid gap-4 xl:px-4">
                    <p className="text-foreground-500">
                        ကျွန်တော်တို့က သုံးစွဲသူ들의 ကိုယ်ရေးကိုယ်တာလုံခြုံရေးနဲ့ အချက်အလက်လုံခြုံရေးကို အလွန်အရေးပါပြီး
                        ကာကွယ်ထားပါတယ်။ Outline Server တိုင်းက သုံးစွဲမှုအချက်အလက်တွေကို စုစည်းပြီး
                        အမည်မဖော်နိုင်တဲ့ပုံစံနဲ့ အလိုအလျောက်ရယူထားပါတယ်။ ဒီအချက်အလက်တွေထဲမှာ သုံးစွဲသူတွေ သွားရောက်တဲ့
                        ဝဘ်ဆိုဒ်တွေ၊ သူတို့ရဲ့ ဆက်သွယ်ရေးအကြောင်းအရာတွေ မပါဝင်ပါဘူး။ ထို့အပြင် Server Admin အနေနဲ့ မင်းက
                        ကိုယ်တိုင် မျှဝေဖို့ ရွေးချယ်မှသာ Outline အဖွဲ့နဲ့ မျှဝေသွားမှာပါ။{" "}
                        <Link href={app.links.outlineVpn.dataCollectionPolicy} target="_blank">
                            ပိုမိုလေ့လာရန်
                        </Link>
                    </p>

                    {hasNoData && <Alert color="danger">Server မက်ထရစ်များကို မရယူနိုင်ပါ။</Alert>}

                    {isLoading && (
                        <div className="grid gap-4">
                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <Card className="bg-transparent" shadow="none">
                                        <CardHeader>
                                            <Skeleton className="w-[200px] h-4 rounded-lg" />
                                        </CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Skeleton className="w-[58px] h-[32px] rounded-full" />

                                            <Skeleton className="w-[300px] h-4 rounded-lg" />
                                        </CardBody>
                                    </Card>

                                    <Divider className="bg-content3 dark:bg-content3/40 md:hidden" />

                                    <Card className="bg-content2 dark:bg-content1" shadow="none">
                                        <CardHeader className="flex justify-between gap-2">
                                            <Skeleton className="w-[200px] h-4 rounded-lg" />
                                            <Skeleton className="w-[42px] h-[24px] rounded-full" />
                                        </CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Skeleton className="w-[58px] h-[32px] rounded-full" />

                                            <Skeleton className="w-[200px] h-4 rounded-lg" />
                                        </CardBody>
                                    </Card>
                                </div>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>
                                        <Skeleton className="w-[350px] h-4 rounded-lg" />
                                    </CardHeader>

                                    <CardBody>
                                        <div className="flex flex-wrap w-full gap-2">
                                            {range(1, 4).map((item) => (
                                                <Skeleton
                                                    key={item}
                                                    className="w-full md:w-[300px] h-[96px] rounded-xl"
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>

                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>
                                        <Skeleton className="w-[280px] h-4 rounded-lg" />
                                    </CardHeader>

                                    <CardBody className="grid gap-2">
                                        <Skeleton className="w-[58px] h-[32px] rounded-full" />
                                    </CardBody>
                                </Card>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>
                                        <Skeleton className="w-[350px] h-4 rounded-lg" />
                                    </CardHeader>

                                    <CardBody className="grid gap-2">
                                        <div className="flex flex-wrap w-full gap-2">
                                            {range(1, 4).map((item) => (
                                                <Skeleton
                                                    key={item}
                                                    className="w-full md:w-[300px] h-[96px] rounded-xl"
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>
                        </div>
                    )}

                    {!isLoading && !hasNoData && (
                        <div className="grid gap-4">
                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <Card className="bg-transparent" shadow="none">
                                        <CardHeader>စုစုပေါင်း Bandwidth သုံးစွဲမှု (နောက်ဆုံး ၃၀ ရက်)</CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Chip color="primary" size="lg" variant="flat">
                                                {formatBytes(metrics!.server.dataTransferred.bytes)}
                                            </Chip>

                                            <span className="text-foreground-400 text-sm">
                                                ဒီအပိုင်းက နောက်ဆုံး ၃၀ ရက်အတွင်း Server မှတစ်ဆင့် လွှဲပြောင်းသွားတဲ့
                                                data စုစုပေါင်းကို ပြထားတာပါ။
                                            </span>
                                        </CardBody>
                                    </Card>

                                    <Divider className="bg-content3 dark:bg-content3/40 md:hidden" />

                                    <Card className="bg-content2 dark:bg-content1" shadow="none">
                                        <CardHeader className="flex justify-between gap-2">
                                            <span>လက်ရှိ Bandwidth သုံးစွဲမှု</span>
                                            <Chip color="primary" size="sm" variant="dot">
                                                {formatBytes(metrics!.server.bandwidth.current.data.bytes)}/s
                                            </Chip>
                                        </CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Chip color="primary" size="lg" variant="flat">
                                                {formatBytes(metrics!.server.bandwidth.peak.data.bytes)}/s
                                            </Chip>

                                            <span className="text-foreground-400 text-sm">
                                                {formatTimestamp(metrics!.server.bandwidth.peak.timestamp * 1000)}
                                            </span>
                                        </CardBody>
                                    </Card>
                                </div>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>Bandwidth အများဆုံးသုံးတဲ့ AS များ (နောက်ဆုံး ၃၀ ရက်)</CardHeader>

                                    <CardBody>
                                        <div className="flex flex-wrap w-full gap-2">
                                            {metrics!.server.locations
                                                .filter((l) => l.asn && l.dataTransferred.bytes > 0)
                                                .map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]"
                                                    >
                                                        <span className="text-sm text-foreground-400">
                                                            {location.asOrg}
                                                        </span>

                                                        <div className="flex items-center justify-between gap-2">
                                                            <Chip color="primary" variant="flat">
                                                                {formatBytes(location.dataTransferred.bytes)}
                                                            </Chip>

                                                            <span>
                                                                {location.asn} {countryCodeToFlag(location.location)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>

                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>စုစုပေါင်း Tunnel Time (နောက်ဆုံး ၃၀ ရက်)</CardHeader>

                                    <CardBody className="grid gap-2">
                                        <Chip color="primary" size="lg" variant="flat">
                                            {formatAdaptiveTime(metrics!.server.tunnelTime.seconds)}
                                        </Chip>
                                    </CardBody>
                                </Card>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>Tunnel Time အများဆုံးရှိတဲ့ AS များ (နောက်ဆုံး ၃၀ ရက်)</CardHeader>

                                    <CardBody className="grid gap-2">
                                        <div className="flex flex-wrap w-full gap-2">
                                            {metrics!.server.locations
                                                .filter((l) => l.asn && l.dataTransferred.bytes > 0)
                                                .map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]"
                                                    >
                                                        <span className="text-sm text-foreground-400">
                                                            {location.asOrg}
                                                        </span>

                                                        <div className="flex items-center justify-between gap-2">
                                                            <Chip color="primary" variant="flat">
                                                                {formatAdaptiveTime(location.tunnelTime.seconds)}
                                                            </Chip>

                                                            <span>
                                                                {location.asn} {countryCodeToFlag(location.location)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
