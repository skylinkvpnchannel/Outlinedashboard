"use client";

import { HeartIcon } from "@/src/components/icons";

export const Footer = () => {
    return (
        <footer className="w-full mt-10">
            {/* top divider */}
            <div className="mx-auto max-w-6xl px-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-default-200 to-transparent dark:via-default-100/20" />
            </div>

            <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* left: made with love */}
                <div className="flex items-center gap-2 text-sm text-default-600">
                    <span>Made with</span>

                    {/* heart with subtle pulse */}
                    <span className="inline-flex items-center">
                        <HeartIcon className="fill-red-500 drop-shadow-sm animate-pulse" size={18} />
                    </span>

                    <span>by</span>
                    <span className="text-foreground font-semibold tracking-wide hover:text-primary transition-colors">
                        Exit
                    </span>
                </div>

                {/* right: copyright + small badge */}
                <div className="flex items-center gap-2 text-xs text-default-500">
                    <span>© {new Date().getFullYear()} Outline Dashboard</span>
                    <span className="px-2 py-0.5 rounded-full bg-default-100 dark:bg-default-100/10 text-default-600">
                        v1.0
                    </span>
                </div>
            </div>
        </footer>
    );
};
