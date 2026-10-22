import { SITE_URL } from '@/content/paper';
import { paperMarkdown } from '@/lib/markdown';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(paperMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
      'X-Robots-Tag': 'noindex',
      Link: `<${SITE_URL}/>; rel="canonical"`,
    },
  });
}
