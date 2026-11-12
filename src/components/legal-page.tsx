import { PageHero } from "@/components/ui";

export type LegalSection = { heading: string; body: string[]; list?: string[] };

export function LegalPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
  slug,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
  slug: string;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      />
      <section className="shell py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
          <div className="prose-premium max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-400">Last updated: {updated}</p>
            {sections.map((section) => (
              <section key={section.heading} id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy-400">On this page</p>
              <nav className="mt-2.5 space-y-1.5">
                {sections.map((section) => (
                  <a
                    key={section.heading}
                    href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="block text-[11.5px] leading-snug text-navy-500 transition hover:text-brand-700"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
              <div className="mt-4 border-t border-navy-100 pt-3">
                <p className="text-[10.5px] font-semibold text-navy-700">Policy reference</p>
                <p className="mt-1 text-[10.5px] text-navy-400">{slug}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
