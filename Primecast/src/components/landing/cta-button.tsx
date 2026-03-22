"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useScrollToPlan } from "@/hooks/use-scroll-to-plan";
import { useScreenSize } from "@/hooks/use-mobile";
import { ArrowRight } from "lucide-react";

export interface CTAButtonProps {
  text: string;
  href?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showArrow?: boolean;
}

export function CTAButton({
  text,
  href = "#yearly-plan",
  className = "",
  variant = "default",
  size = "lg",
  showArrow = true,
}: CTAButtonProps) {
  const scrollToPlan = useScrollToPlan();
  const { screenSize, isMobile } = useScreenSize();

  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToPlan(href.substring(1));
    }
  };

  // Adjust size based on screen size
  const responsiveSize = isMobile ? "default" : size;
  const responsiveClassName = `
    shadow-md hover:shadow-lg transition-shadow duration-200 will-change-[box-shadow]
    w-full sm:w-auto text-center justify-center
    ${isMobile ? 'py-2 px-4 text-sm' : ''}
    ${className}
  `;

  return (
    <Button
      variant={variant}
      size={responsiveSize}
      className={responsiveClassName}
      onClick={handleClick}
      asChild
    >
      <Link href={href} className="flex items-center gap-2">
        {text}
        {showArrow && <ArrowRight className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ml-1`} />}
      </Link>
    </Button>
  );
}
