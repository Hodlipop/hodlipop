import { getTranslations } from "next-intl/server";

import {
  ProfileLinkIcon,
  type ProfileLinkIconType,
} from "@/components/icons/ProfileLinkIcons";

type ProfileLink = {
  label: string;
  url: string;
  icon: ProfileLinkIconType;
};

type ProfileLinksData = {
  label: string;
  items: ProfileLink[];
};

export async function ProfileLinks() {
  const profileLinks = (await getTranslations("timeline")).raw(
    "profileLinks",
  ) as ProfileLinksData;

  return (
    <section className="mx-auto max-w-site px-6 pb-8">
      <p className="mb-3 text-xs font-semibold tracking-widest text-accent">
        {profileLinks.label}
      </p>
      <div className="flex flex-wrap gap-3">
        {profileLinks.items.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-card-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <ProfileLinkIcon type={link.icon} />
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
