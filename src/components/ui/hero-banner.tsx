import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    style?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    style?: string;
  };
  useContainer?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  backgroundImage?: string;
  overlayColor?: string;
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";
  gradientFromColor?: string;
  gradientToColor?: string;
}

export function HeroBanner({
  className,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  useContainer = false,
  maxWidth = "xl",
  backgroundImage = "/images/2025-07-23_19-04.png",
  overlayColor = "rgba(0, 0, 0, 0.5)",
  gradientDirection = "to-r",
  gradientFromColor = "from-primary-purple",
  gradientToColor = "to-secondary-blue",
  ...props
}: HeroBannerProps) {
  const renderButton = (
    action: { label: string; onClick?: () => void; href?: string },
    isSecondary: boolean,
    style?: string
  ) => {
    const buttonClassName = cn(
      isSecondary
        ? `border border-white bg-transparent text-white hover:bg-white/10 ${style}`
        : `bg-white hover:bg-gray-100 shadow-sm ${style} text-black`
    );

    if (action.href) {
      return (
        <Link href={action.href} passHref>
          <Button className={buttonClassName} onClick={action.onClick}>
            {action.label}
          </Button>
        </Link>
      );
    }

    return (
      <Button className={buttonClassName} onClick={action.onClick}>
        {action.label}
      </Button>
    );
  };

  const Content = () => (
    <>
      <h1 className="text-base font-bold text-white sm:text-lg md:text-xl min-[1024px]:text-2xl min-[1230px]:text-3xl xl:text-4xl 2xl:text-5xl">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 max-w-3xl text-sm text-white opacity-90  sm:text-sm md:text-lg lg:text-xl">
          {subtitle}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap gap-4">
          {primaryAction && renderButton(primaryAction, false, primaryAction?.style || "")}
          {secondaryAction && renderButton(secondaryAction, true, secondaryAction?.style || "")}
        </div>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "flex aspect-[25/9] max-h-[400px] w-full flex-row overflow-hidden rounded-lg bg-cover bg-center text-white",
        className
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      {...props}
    >
      {/* Overlay to darken image */}
      {/* <div className="absolute inset-0 rounded-lg " /> */}

      {/* Content Layer */}
      <div className="z-10 flex h-full flex-1 items-center ">
        {useContainer ? (
          <Container maxWidth={maxWidth} className="px-4 sm:px-6 md:px-8 lg:px-12">
            <Content />
          </Container>
        ) : (
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
            <Content />
          </div>
        )}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
