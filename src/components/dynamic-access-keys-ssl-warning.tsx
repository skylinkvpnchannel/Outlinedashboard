"use client";

import { useEffect, useState } from "react";
import { Alert } from "@heroui/react";

export default function DynamicAccessKeysSslWarning() {
    const [isHttp, setIsHttp] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.location?.protocol === "http:") {
            setIsHttp(true);
        }
    }, []);

    if (!isHttp) return null;

    return (
        <Alert color="warning">
            ဒီ feature ကို အသုံးပြုဖို့ SSL (HTTPS) ပါတဲ့ မှန်ကန်တဲ့ domain name တစ်ခု လိုအပ်ပါတယ်။
        </Alert>
    );
}
