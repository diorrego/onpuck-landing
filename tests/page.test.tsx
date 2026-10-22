import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import Paper from '@/components/paper/Paper';
import { paper, CTA_LABEL, CONTACT_EMAIL } from '@/content/paper';
import { references } from '@/content/references';

vi.mock('@/app/actions', () => ({ applyDesignPartner: vi.fn(), joinWaitlist: vi.fn() }));

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({
    matches: false, media: q, addEventListener() {}, removeEventListener() {}, onchange: null,
    addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

describe('the light paper page', () => {
  const setup = () => render(<Paper />);

  it('has one main, one article and exactly one h1 with the headline', () => {
    const { container } = setup();
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(container.querySelectorAll('main article')).toHaveLength(1);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(paper.hero.headline);
  });

  it('renders every section as section#id with its h2 and a self link', () => {
    const { container } = setup();
    for (const s of paper.sections) {
      const el = container.querySelector(`section#${s.id}`);
      expect(el, s.id).not.toBeNull();
      const h2 = el!.querySelector('h2')!;
      expect(h2).toHaveTextContent(s.title);
      expect(el!.querySelector(`a[href="#${s.id}"]`)).not.toBeNull();
    }
    expect(container.querySelector('section#references h2')).toHaveTextContent('References');
  });

  it('has a contents nav linking every section', () => {
    setup();
    const toc = screen.getAllByRole('navigation', { name: 'Contents' })[0];
    const hrefs = within(toc).getAllByRole('link').map((a) => a.getAttribute('href'));
    for (const s of paper.sections) expect(hrefs).toContain(`#${s.id}`);
    expect(hrefs).toContain('#references');
  });

  it('numbers four figures, each with a figcaption', () => {
    const { container } = setup();
    const figures = [...container.querySelectorAll('figure[id^="fig-"]')];
    expect(figures.map((f) => f.id)).toEqual(['fig-1', 'fig-2', 'fig-3', 'fig-4']);
    for (const f of figures) expect(f.querySelector('figcaption')?.textContent).toMatch(/^Fig\. \d/);
  });

  it('lists every reference with a stable anchor, a cite and a working link', () => {
    const { container } = setup();
    const items = [...container.querySelectorAll('#references ol > li')];
    expect(items.map((li) => li.id)).toEqual(references.map((r) => `ref-${r.id}`));
    for (const li of items) {
      expect(li.querySelector('cite')).not.toBeNull();
      expect(li.querySelector('a[href^="https://"]')).not.toBeNull();
    }
  });

  it('resolves every in-text citation to a reference on the page', () => {
    const { container } = setup();
    const ids = new Set([...container.querySelectorAll('[id^="ref-"]')].map((e) => e.id));
    const cites = [...container.querySelectorAll('a[href^="#ref-"]')];
    expect(cites.length).toBeGreaterThan(40);
    for (const a of cites) expect(ids).toContain(a.getAttribute('href')!.slice(1));
  });

  it('gives each experiment a row anchor', () => {
    const { container } = setup();
    for (const id of ['exp-01', 'exp-02', 'exp-03', 'exp-04']) expect(container.querySelector(`#${id}`)).not.toBeNull();
  });

  it('points every CTA at the apply section with the one label', () => {
    setup();
    const ctas = screen.getAllByRole('link', { name: CTA_LABEL });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    for (const a of ctas) expect(a).toHaveAttribute('href', '#apply');
  });

  it('has a five-field application form with labels', () => {
    setup();
    const form = screen.getByRole('form', { name: /design partner application/i });
    for (const label of [/work email/i, /company url/i, /your role/i, /did not do what you expected/i, /stack/i]) {
      expect(within(form).getByLabelText(label)).toBeInTheDocument();
    }
    expect(within(form).getByRole('button', { name: CTA_LABEL })).toHaveAttribute('type', 'submit');
  });

  it('marks the scene as decorative and keeps its text in the DOM', () => {
    const { container } = setup();
    for (const canvasBox of container.querySelectorAll('[data-scene]')) {
      expect(canvasBox.querySelector('[aria-hidden="true"]')).not.toBeNull();
    }
    expect(screen.getAllByText(/Illustration of a simulated run/).length).toBeGreaterThan(0);
  });

  it('answers the FAQ in disclosure widgets', () => {
    const { container } = setup();
    expect(container.querySelectorAll('#faq details')).toHaveLength(paper.faq.length);
  });

  it('publishes the contact email as a mailto link', () => {
    setup();
    expect(screen.getAllByRole('link', { name: CONTACT_EMAIL })[0]).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
  });

  it('never renders an em dash', () => {
    const { container } = setup();
    expect(container.textContent).not.toContain('—');
  });
});
