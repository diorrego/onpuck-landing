import { Fragment } from 'react';
import { parseInline } from '@/lib/inline';
import Cite from '@/components/ui/Cite';

type Props = { text: string };

/** Renders the content grammar: [n] citations, `code`, **strong**, [label](href). */
export default function Inline({ text }: Props) {
  return (
    <>
      {parseInline(text).map((token, i) => {
        switch (token.type) {
          case 'text':
            return <Fragment key={i}>{token.value}</Fragment>;
          case 'cite':
            return <Cite key={i} ids={token.ids} />;
          case 'code':
            return <code key={i}>{token.value}</code>;
          case 'strong':
            return (
              <strong key={i} className="font-bold">
                {token.value}
              </strong>
            );
          case 'link':
            return (
              <a key={i} href={token.href} className="link">
                {token.value}
              </a>
            );
        }
      })}
    </>
  );
}
