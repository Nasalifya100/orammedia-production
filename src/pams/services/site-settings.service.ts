import { getDb } from "@/pams/db";

const KEYS = {
  homepageHeroPath: "homepage.hero.path",
  homepageOgPath: "homepage.og.path",
  showreelPosterPath: "showreel.poster.path",
  flagshipSlug: "flagship.production.slug",
} as const;

const DEFAULTS = {
  [KEYS.homepageHeroPath]: "/projects/inkondo-billboard.jpg",
  [KEYS.homepageOgPath]: "/projects/inkondo-billboard.jpg",
  [KEYS.showreelPosterPath]: "/projects/inkondo-billboard.jpg",
  [KEYS.flagshipSlug]: "inkondo",
} as const;

export const siteSettingsService = {
  async get(key: string): Promise<string> {
    const db = await getDb();
    const row = await db.siteSetting.findUnique({ where: { key } });
    if (row) return row.value;
    return DEFAULTS[key as keyof typeof DEFAULTS] ?? "";
  },

  async getHomepageHero(): Promise<string> {
    return this.get(KEYS.homepageHeroPath);
  },

  async getShowreelPoster(): Promise<string> {
    return this.get(KEYS.showreelPosterPath);
  },

  async getFlagshipSlug(): Promise<string> {
    return this.get(KEYS.flagshipSlug);
  },

  async set(key: string, value: string) {
    const db = await getDb();
    return db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  },

  async ensureDefaults() {
    const db = await getDb();
    for (const [key, value] of Object.entries(DEFAULTS)) {
      await db.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: {},
      });
    }
  },
};
