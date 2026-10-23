import { CONTACT_EMAIL, founders, paper, program, SITE_URL } from '@/content/paper';
import { references } from '@/content/references';
import { parseCalLink } from '@/components/apply/CalEmbed';

export const dynamic = 'force-static';

// llmstxt.org: an H1 with the name, a blockquote summary, optional prose, then H2 sections of
// "- [name](url): notes" link lists. "Optional" holds what an agent can skip.
export async function GET() {
  const cal = parseCalLink(process.env.NEXT_PUBLIC_CALCOM_LINK ?? '');
  const terms = program.terms.map((t) => `${t.label.toLowerCase()}: ${t.value.toLowerCase()}`).join('; ');
  const body = [
    '# OnPuck',
    `> ${paper.description}`,
    `${paper.abstract} Today the founders run the model for each design partner; the simulator is a research prototype validated on woku, with its misses published. Contact: ${CONTACT_EMAIL}.`,
    '## Light paper',
    [
      `- [Light paper as Markdown](${SITE_URL}/index.md): the full page as text, with figures, experiments and references`,
      `- [Light paper](${SITE_URL}/): the same content as HTML`,
      `- [The model](${SITE_URL}/#model): connect, listen, anchor, spec, simulate, ship, calibrate`,
      `- [Validation comes first](${SITE_URL}/#evidence): four experiments on woku, misses included, one blind prediction pending`,
      `- [Limits](${SITE_URL}/#limits): what OnPuck cannot promise, and the mitigation for each`,
    ].join('\n'),
    '## Design partner program',
    [
      `- [Program](${SITE_URL}/#program): ${terms}`,
      `- [Apply](${SITE_URL}/#apply): work email, company URL, role, a recent change that did not do what you expected, stack. A person must submit it`,
      ...(cal ? [`- [Book a 30-minute call](https://cal.com/${cal.username}/${cal.eventSlug}): with the founders, no application needed`] : []),
      `- [Questions](${SITE_URL}/#faq): access and data, time, cost, who runs it`,
    ].join('\n'),
    '## About',
    [
      ...founders.map((f) => `- [${f.name}](${f.linkedin}): ${f.role.toLowerCase()}, ${f.line.charAt(0).toLowerCase()}${f.line.slice(1).replace(/\.$/, '')}`),
      `- [woku](https://woku.app/en): the founders' product in production, OnPuck's lab`,
    ].join('\n'),
    '## Optional',
    [
      `- [References](${SITE_URL}/#references): ${references.length} papers behind every claim`,
      `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ].join('\n'),
  ].join('\n\n');
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
