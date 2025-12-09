import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import { getTags } from "@/src/core/actions/tags";
import TagsList from "@/src/components/tags-list";

// ✅ build time မှာ static generate မလုပ်ဘဲ runtime မှာပဲ DB ခေါ်အောင်
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: createPageTitle("Tags")
};

export default async function TagsPage() {
    const tags = await getTags({});

    return <TagsList data={tags} />;
}
