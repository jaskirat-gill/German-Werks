'use client';

import { TiltCard } from "components/animations/tilt-card";
import clsx from "clsx";
import Image from "next/image";
import Price from "../price";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  const content = (
    <div
      className={clsx(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-gw-dark",
        {
          "border-2 border-gw-accent": active,
          "border-[#222222] hover:border-[#222222]": !active,
        },
      )}
    >
      {/* Image area */}
      <div className="relative flex-1">
        {props.src ? (
          <Image
            className={clsx("h-full w-full object-contain", {
              "transition duration-300 ease-in-out group-hover:scale-105":
                isInteractive,
            })}
            {...props}
          />
        ) : null}
      </div>

      {/* Red accent line on hover */}
      <div className="h-[2px] w-full bg-transparent transition-colors group-hover:bg-gw-accent" />

      {/* Product info */}
      {label ? (
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gw-text">{label.title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <Price
              className="text-sm font-bold text-gw-text"
              amount={label.amount}
              currencyCode={label.currencyCode}
            />
            <span className="text-[10px] uppercase tracking-wider text-gw-accent">
              View →
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );

  return isInteractive ? <TiltCard>{content}</TiltCard> : content;
}
