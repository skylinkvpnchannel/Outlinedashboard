"use client";

import NextLink from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button, useDisclosure } from "@heroui/react";
import { useForm } from "react-hook-form";
import { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  BellIcon,
  DynamicAccessKeyIcon,
  HashtagIcon,
  HealthCheckIcon,
  Logo,
  ServersIcon,
} from "@/src/components/icons";

import { app } from "@/src/core/config";
import { logout } from "@/src/core/actions";
import { ThemeSwitch } from "@/src/components/theme-switch";

const menuItems = [
  {
    label: "Servers",
    subLabel: "ဆာဗာများ",
    pathName: "/servers",
    icon: <ServersIcon size={22} />,
  },
  {
    label: "Dynamic Access Keys",
    subLabel: "Access Key များ",
    pathName: "/dynamic-access-keys",
    icon: <DynamicAccessKeyIcon size={22} />,
  },
  {
    label: "Health Checks",
    subLabel: "စစ်ဆေးမှု",
    pathName: "/health-checks",
    icon: <HealthCheckIcon size={22} />,
  },
  {
    label: "Notification Channels",
    subLabel: "သတိပေးချက်များ",
    pathName: "/notification-channels",
    icon: <BellIcon size={22} />,
  },
  {
    label: "Tags",
    subLabel: "တက်ဂ်များ",
    pathName: "/tags",
    icon: <HashtagIcon size={22} />,
  },
];

interface Props {
  drawerDisclosure?: UseDisclosureReturn;
}

export const SideMenu = ({ drawerDisclosure }: Props) => {
  const currentPathname = usePathname();
  useDisclosure(); // future use, now safe to keep
  const logoutForm = useForm();

  const handleLogout = async () => {
    await logout();
  };

  const handleDrawerClose = () => {
    if (drawerDisclosure) drawerDisclosure.onClose();
  };

  return (
    <div className="flex flex-col justify-between gap-2 h-screen w-[300px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 xl:fixed text-gray-900 dark:text-gray-100">
      {/* Top */}
      <div className="mt-6 px-4">
        <div className="grid gap-3">
          <NextLink
            className="w-fit justify-self-center flex flex-col items-center gap-2"
            href="/"
            onClick={handleDrawerClose}
          >
            <Logo size={56} />
            <p className="font-bold tracking-wide">
              {app.name.toUpperCase()}
            </p>
          </NextLink>

          <div className="flex items-center justify-center">
            <ThemeSwitch />
          </div>
        </div>

        <nav className="grid gap-2 mt-8">
          {menuItems.map((item) => {
            const active = currentPathname.startsWith(item.pathName);
            return (
              <NextLink
                key={item.pathName}
                href={item.pathName}
                onClick={handleDrawerClose}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition",
                  active
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                <div className="shrink-0">{item.icon}</div>

                {/* English + Myanmar labels */}
                <div className="flex flex-col leading-tight">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs opacity-70">{item.subLabel}</span>
                </div>
              </NextLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 grid gap-3">
        <form onSubmit={logoutForm.handleSubmit(handleLogout)}>
          <Button
            color="danger"
            fullWidth
            isLoading={logoutForm.formState.isSubmitting}
            type="submit"
            variant="flat"
          >
            Logout
          </Button>
        </form>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} {app.name}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
