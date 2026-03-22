"use client";

import { usePathname } from "next/navigation";
import { TawkChat } from "@/components/ui/tawk-chat";

export function ChatGate() {
  const pathname = usePathname();

  // Disable chat on subscribe routes
  if (pathname?.startsWith("/subscribe")) {
    return null;
  }

  return (
    <TawkChat siteId={"6828491f3cb2bd190f12ce2c"} widgetId={"1irelrb2r"} />
  );
}

