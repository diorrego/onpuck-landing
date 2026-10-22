import { apply, CONTACT_EMAIL, paper, program, SITE_URL } from '@/content/paper';

export const dynamic = 'force-static';

export async function GET() {
  const body = [
    '# onpuck',
    `> ${paper.abstract}`,
    `${paper.hero.headline} ${paper.hero.subline}`,
    '## Read',
    [
      `- [The light paper in Markdown](${SITE_URL}/index.md): the whole page as text, with the experiments and 36 references`,
      `- [The light paper](${SITE_URL}/): the same content as HTML`,
      `- [Validation comes first](${SITE_URL}/#evidence): four experiments on woku, misses included, one blind prediction pending`,
      `- [Limits](${SITE_URL}/#limits): what onpuck cannot promise and why`,
      `- [References](${SITE_URL}/#references)`,
    ].join('\n'),
    '## Apply',
    [
      `- [Design partner program](${SITE_URL}/#program): ${program.terms.map((t) => `${t.label.toLowerCase()} ${t.value.toLowerCase()}`).join('; ')}`,
      `- [Application form](${SITE_URL}/#apply): ${Object.values(apply.fields)
        .map((f) => f.label)
        .join(', ')}. A person must submit it.`,
      `- Contact: ${CONTACT_EMAIL}`,
    ].join('\n'),
  ].join('\n\n');
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
