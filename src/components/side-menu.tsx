"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import type { UseDisclosureReturn } from "@heroui/use-disclosure";
import { motion } from "framer-motion";

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
  const logoutForm = useForm();

  const handleLogout = async () => {
    await logout();
  };

  const handleDrawerClose = () => {
    if (drawerDisclosure) drawerDisclosure.onClose();
  };

  return (
    <aside
      className="
        relative h-screen w-[280px] sm:w-[300px]
        xl:fixed
        flex flex-col justify-between
        text-foreground
        border-r border-white/10 dark:border-slate-800
        bg-white/70 dark:bg-slate-950/60
        backdrop-blur-xl
        shadow-xl
      "
    >
      {/* soft gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-24 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-400/10 blur-3xl rounded-full" />
      </div>

      {/* Top */}
      <div className="relative mt-6 px-4">
        {/* Logo + app name */}
        <NextLink
          className="w-full flex flex-col items-center gap-2"
          href="/"
          onClick={handleDrawerClose}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative grid place-items-center w-16 h-16 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-400/25 via-cyan-400/20 to-purple-400/20 blur-lg" />
            <Logo size={52} />
          </motion.div>

          <div className="grid place-items-center">
            <p className="font-extrabold tracking-wider text-lg">
              {app.name.toUpperCase()}
            </p>
            <p className="text-xs text-foreground-500">Admin Dashboard</p>
          </div>
        </NextLink>

        {/* Theme Switch */}
        <div className="flex items-center justify-center mt-4">
          <ThemeSwitch />
        </div>

        {/* Navigation */}
        <nav className="grid gap-1.5 mt-8">
          {menuItems.map((item, idx) => {
            const active = currentPathname.startsWith(item.pathName);

            return (
              <motion.div
                key={item.pathName}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <NextLink
                  href={item.pathName}
                  onClick={handleDrawerClose}
                  className={[
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all",
                    active
                      ? "bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent text-emerald-700 dark:text-emerald-200"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-foreground dark:text-foreground",
                  ].join(" ")}
                >
                  {active && (
                    <span className="absolute left-1 top-1.5 bottom-1.5 w-1 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                  )}

                  <div
                    className={[
                      "shrink-0 grid place-items-center w-9 h-9 rounded-xl transition",
                      active
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                        : "bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500/10",
                    ].join(" ")}
                  >
                    {item.icon}
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <span className="text-[11px] opacity-70">{item.subLabel}</span>
                  </div>

                  <span className="ml-auto opacity-0 group-hover:opacity-70 transition text-xs">
                    →
                  </span>
                </NextLink>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="relative p-4 grid gap-3">
        <form onSubmit={logoutForm.handleSubmit(handleLogout)}>
          <Button
            color="danger"
            fullWidth
            isLoading={logoutForm.formState.isSubmitting}
            type="submit"
            radius="lg"
            variant="shadow"
            className="bg-gradient-to-r from-rose-500 to-red-600 text-white"
          >
            Logout
          </Button>
        </form>

        <div className="text-[11px] text-foreground-500 text-center">
          © {new Date().getFullYear()} Outline Dashboard
        </div>
      </div>
    </aside>
  );
};

export default SideMenu;
