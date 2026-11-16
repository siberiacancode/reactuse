import type { ComponentProps } from "react";

import { cn } from "@/src/lib";

export const UwuLogo = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    aria-label="ReactUse"
    className={cn("inline-flex [.classic-logo_&]:hidden", className)}
    role="img"
    {...props}
  >
    <img
      alt=""
      className="h-auto w-full dark:hidden"
      height={615}
      src="/brand/reactuse-uwu-light.svg"
      width={1720}
    />

    <img
      alt=""
      className="hidden h-auto w-full dark:block"
      height={615}
      src="/brand/reactuse-uwu-dark.svg"
      width={1720}
    />
  </span>
);
