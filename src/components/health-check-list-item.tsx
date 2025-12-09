import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from "@heroui/react";
import React from "react";

import { HealthCheckWithServerAndChannel } from "@/src/core/definitions";

interface Props {
    item: HealthCheckWithServerAndChannel;
}

export default function HealthCheckListItem({ item }: Props) {
    const renderChannelName = () => {
        if (!item.notificationChannel || item.notificationChannel.type === "None") {
            return "အသိပေးချက် မရှိပါ";
        }

        return item.notificationChannel.name + " (" + item.notificationChannel.type + ")";
    };

    return (
        <Card className="w-[320px]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md">{item.server.name}</p>
                    <p className="text-small text-default-500">{item.server.hostnameOrIp}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid gap-2 text-sm">
                    <div className="flex justify-between items-center gap-2">
                        <span>အခြေအနေ:</span>
                        {item.isAvailable ? (
                            <Chip color="success" radius="sm" size="sm" variant="flat">
                                ရရှိနိုင်ပါသည်
                            </Chip>
                        ) : (
                            <Chip color="danger" radius="sm" size="sm" variant="flat">
                                မရရှိနိုင်ပါ
                            </Chip>
                        )}
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>နောက်ဆုံး စစ်ဆေးချိန်:</span>
                        <Chip radius="sm" size="sm" variant="flat">
                            {item.lastCheckedAt?.toLocaleString() ?? "မစစ်ဆေးရသေးပါ"}
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>ကြားကာလ:</span>
                        <Chip radius="sm" size="sm" variant="flat">
                            {item.interval} မိနစ်တိုင်း
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>အသိပေးချက်:</span>
                        <Chip radius="sm" size="sm" variant="flat">
                            {renderChannelName()}
                        </Chip>
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <Button as={Link} fullWidth={true} href={`/health-checks/${item.id}`} variant="flat">
                    ပြင်မယ်
                </Button>
            </CardFooter>
        </Card>
    );
}
