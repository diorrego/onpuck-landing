import Accordion from '@/components/ui/Accordion';
import Inline from '@/components/ui/Inline';
import { paper } from '@/content/paper';

export default function Faq() {
  return (
    <Accordion
      trackEvent="faq_open"
      items={paper.faq.map((f, i) => ({
        id: `faq-${i + 1}`,
        title: f.q,
        content: f.a.map((p, j) => (
          <p key={j}>
            <Inline text={p} />
          </p>
        )),
      }))}
    />
  );
}
