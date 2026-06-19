import { getLocale } from "next-intl/server";

import { getTimelineLogos } from "@/lib/timeline-logos";

type TimelineItemLogosProps = {
  itemId: string;
  compact?: boolean;
};

export async function TimelineItemLogos({
  itemId,
  compact = false,
}: TimelineItemLogosProps) {
  const locale = await getLocale();
  const logos = getTimelineLogos(itemId, locale);
  const size = compact ? "h-12 w-12" : "h-14 w-14";

  return (
    <div
      className={`flex shrink-0 flex-wrap items-start justify-start gap-2 lg:max-w-[16rem] lg:justify-end ${
        compact ? "max-w-[11rem]" : ""
      }`}
    >
      {logos.length > 0 ? (
        logos.map((logo) => (
          <div
            key={logo.src}
            title={logo.alt}
            className={`${size} cursor-default overflow-hidden rounded-lg border border-card-border bg-white transition-shadow hover:shadow-md`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.alt}
              className="block h-full w-full object-contain"
            />
          </div>
        ))
      ) : (
        <div
          className={`${size} rounded-lg border border-dashed border-card-border/60 bg-card/20`}
          aria-hidden
        />
      )}
    </div>
  );
}
