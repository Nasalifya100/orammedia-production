import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "Contact — Film Production Lusaka",
  description:
    "Contact Oram Media Dynamics in Lusaka for television drama, feature films and institutional video production across Zambia.",
};

export default function ContactPage() {
  const { address } = siteConfig;

  const details = [
    {
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      label: "Phone",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    },
    {
      label: "Studio",
      value: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Start a project."
        description="Tell us about your vision. We typically respond within 24 hours."
        image="/media/bts/inkondo-shoot-s2.jpg"
        imageAlt="Oram Media Dynamics on location — Inkondo Season 2"
      />

      <section className="section bg-surface-0">
        <Container>
          <div className="grid gap-16 lg:grid-cols-5 lg:gap-24">
            <div className="lg:col-span-2">
              <p className="eyebrow mb-10">Contact</p>

              <dl className="border-t border-line">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[100px_1fr] gap-4 border-b border-line py-5"
                  >
                    <dt className="eyebrow">{item.label}</dt>
                    <dd>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="link-line text-foreground"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-ink-dim">{item.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 border border-accent/25 bg-accent-soft p-6">
                <p className="eyebrow eyebrow-accent">Urgent inquiries</p>
                <p className="mt-3 text-sm text-ink-dim">
                  For time-sensitive production needs, call our priority line:
                </p>
                <a
                  href={`tel:${siteConfig.emergencyPhone.replace(/\s/g, "")}`}
                  className="link-line mt-2 inline-block text-foreground"
                >
                  {siteConfig.emergencyPhone}
                </a>
              </div>

              <div className="mt-10 aspect-video overflow-hidden border border-line">
                <iframe
                  title="Oram Media Dynamics studio location"
                  src="https://maps.google.com/maps?q=MKP+Apartments+Chainama+Lusaka+Zambia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full border-0 opacity-80 grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
