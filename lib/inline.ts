// Tiny inline grammar shared by the HTML page and the Markdown twin:
// [12] or [5, 6] citations, `code`, **strong** and [label](href) links.

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'cite'; ids: number[] }
  | { type: 'code'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'link'; value: string; href: string };

const PATTERN =
  /\[(\d+(?:,\s*\d+)*)\](?!\()|`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(source: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of source.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: 'text', value: source.slice(last, index) });
    const [, cites, code, strong, label, href] = match;
    if (cites) tokens.push({ type: 'cite', ids: cites.split(',').map((n) => Number(n.trim())) });
    else if (code) tokens.push({ type: 'code', value: code });
    else if (strong) tokens.push({ type: 'strong', value: strong });
    else tokens.push({ type: 'link', value: label, href });
    last = index + match[0].length;
  }
  if (last < source.length) tokens.push({ type: 'text', value: source.slice(last) });
  return tokens;
}

export function citationIds(source: string): number[] {
  const ids: number[] = [];
  for (const token of parseInline(source)) {
    if (token.type !== 'cite') continue;
    for (const id of token.ids) if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** Plain text: citations kept as [n], code and emphasis unwrapped, links reduced to their label. */
export function plainText(source: string): string {
  return parseInline(source)
    .map((t) => (t.type === 'cite' ? `[${t.ids.join(', ')}]` : t.value))
    .join('');
}
