"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the subscription page with success parameter
    router.replace("/subscribe?success=true");
  }, [router]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <p>Redirecting to confirmation page...</p>
    </div>
  );
}
