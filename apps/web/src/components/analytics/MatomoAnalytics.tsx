"use client";

import { trackAppRouter } from "@socialgouv/matomo-next";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function MatomoAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const siteId =
    process.env.NEXT_PUBLIC_MATOMO_SITE_ID ??
    process.env.NEXT_PUBLIC_MATOMO_PROXY_SITE_ID;

  useEffect(() => {
    if (!siteId) return;

    trackAppRouter({
      siteId,
      pathname,
      searchParams,
    });
  }, [pathname, searchParams, siteId]);

  return null;
}
