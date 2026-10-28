// Site-wide copy: nav, footer, the hero scene's labels and the error pages. Kept apart from the
// paper so client components (the error boundary) can import it without shipping the paper.
// content/paper.ts re-exports these; the paper stays the single source for everything else.

export const CTA_LABEL = 'Apply to be a design partner';
export const CONTACT_EMAIL = 'paula@onpuck.com';
export const VERSION = '1.0';
export const SITE_URL = 'https://www.onpuck.com';
export const PURPOSE_LINE = 'We exist to turn stories into evidence, and evidence into better decisions.';

export const founders = [
  { name: 'Paula Riquelme', short: 'P. Riquelme', role: 'Co-founder, engineer', line: 'Researches and builds the models behind OnPuck.', linkedin: 'https://www.linkedin.com/in/pauriquelme/' },
  { name: 'Diego Orrego', short: 'D. Orrego', role: 'Co-founder, engineer', line: 'Researches and builds the models behind OnPuck.', linkedin: 'https://www.linkedin.com/in/diorrego' },
];

/** Primary nav: section ids of the paper (checked in content/site.test.ts). */
export const navLinks = [
  { id: 'model', label: 'Model' },
  { id: 'field-work', label: 'Field work' },
  { id: 'evidence', label: 'Simulation tests' },
  { id: 'research', label: 'Research' },
  { id: 'limits', label: 'Limits' },
  { id: 'program', label: 'Program' },
];

export const scene = {
  label: 'Illustration of a simulated run',
  status: { onFloor: 'on the floor', frustrated: 'frustrated now', done: 'tasks done', left: 'gave up' },
};

export const errorCopy = {
  back: 'Back to the light paper',
  notFound: {
    meta: 'Page not found · OnPuck',
    title: 'This page is not in the paper',
    line: 'The link may be old or mistyped. The simulated people are still at work.',
  },
  error: {
    meta: 'Something went wrong · OnPuck',
    title: 'Something broke on this page',
    line: 'It is on us, not you. Try again, or go back to the light paper.',
    retry: 'Try again',
  },
};
