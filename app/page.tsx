import Paper from '@/components/paper/Paper';
import { buildJsonLd, serializeJsonLd } from '@/lib/jsonld';

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd()) }} />
      <Paper />
    </>
  );
}
