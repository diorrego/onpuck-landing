# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: CTOs and technical founders of seed to Series A software startups in San Francisco,
who ship weekly with coding agents (Claude Code, Codex, Cursor) and run PostHog, Sentry, logs and
a production database. They arrive evaluating whether to become an onpuck design partner. They
are skeptical of AI hype and read methodology before believing claims.

Secondary: AI agents and LLM search (ChatGPT, Claude, Perplexity, Google AI Overviews) that read,
summarise and cite the page for those same people.

## Product Purpose

onpuck turns users' stories into evidence and evidence into better product decisions. It connects
read-only to a startup's repo, analytics, observability and database; an AI interviewer talks to
the startup's users about one concrete, recent episode; each detail of the story that the system
could have recorded (a tracker) is checked against real data; stories become specs a coding
agent implements; before a spec is built, simulated users calibrated on the startup's own
sessions predict what will change; after it ships, prediction and reality are compared.

Success for the landing: qualified design partner applications (goal: 5 SF design partners by
2027-04-22). Source: `business-vault/company/strategy/README.md`.

## Positioning

The only approach that joins three things: interviews anchored in the startup's own system data,
specs for its coding agent, and simulated users calibrated on that same data, with accuracy
published through blind predictions. AI-moderated research tools do not check stories against
data; simulated-people companies simulate attitudes, not software behaviour, and publish no
accuracy; analytics tools show how many, never why.

## Operating Context

- Partners today get the onpuck model run by the founders as consultants (agents and scripts);
  the platform is built with the partners. Nothing self-serve exists.
- Design partner terms (draft): 3 months, free, check-in every two weeks, connect repo and one
  data source in the first two weeks. CRM is Attio.
- Lab: woku (woku.app), a feedback product in production run by the same founders. It may be
  named publicly.

## Capabilities and Constraints

- Steps connect, listen, anchor and spec are specified (`core/SPECS.md`), run manually today.
- The simulator is a research prototype (LLM plus explicit fatigue/frustration state, Playwright
  sandbox), used in experiments exp-01 to exp-04.
- Must not claim: exact magnitudes, "users will love it", replacing talking to users, any
  accuracy figure not measured, customers, logos or testimonials.
- Stack: Next.js 16, React 19, Tailwind 4, deployed on Vercel at www.onpuck.com; GTM and
  Microsoft Clarity present. English only.

## Brand Commitments

- Name: onpuck (lowercase in running text).
- Public contact: paula@onpuck.com.
- Purpose line: "We exist to turn stories into evidence, and evidence into better decisions."
- One-liner: "Agents that research human stories with real data, code and systems, and test the
  resulting specs on simulated users before you build them."
- Founder-pinned visual direction for the landing redesign: light background; an animated
  isometric scene in the spirit of Habbo and classic handheld Pokemon games, showing people
  sitting, standing and walking while using computers, tablets, phones and smart speakers; the
  page reads as a light paper with references; no dates; every CTA invites design partners.
  Reference liked: simile.com (not to be copied). Habbo and Pokemon IP must not be copied.

## Evidence on Hand

- 34 references with verified titles and first authors: `business-vault/engineering/product-model.md`.
- Own experiments (woku as lab), `onpuck/research`:
  - exp-01: predicted direction of a past change; "nothing changes" did too.
  - exp-02: reproduced abandonment out of sample (0.24 vs 0.20 real); found a real bug (form
    tabs submitted the form), fixed in production.
  - exp-03: predicted Δ −0.011 [−0.046, +0.025] vs real −0.022 [−0.084, +0.040]; interval 62 %
    narrower; excludes the generic prior.
  - exp-04: blind prediction registered before a live A/B (first action = writing, 7 % to 20 %);
    resolves 2026-11-19.
- Integration logos in `public/` (GitHub, Sentry, PostHog, CloudWatch, Axiom, Postgres, MongoDB,
  Google Meet, Claude Code, Codex, Cursor, OpenCode, Kimi, Copilot).
- Absent and must not be fabricated: customers, testimonials, logos of users, pricing, accuracy
  beyond the experiments above, team photos.

## Product Principles

1. Prove, do not claim: every claim links to a paper or an experiment.
2. Honest limits are part of the pitch: say what simulation cannot do.
3. Built for people who live in their coding agent: specs and evidence over MCP.
4. Behaviour over opinion: what users did, checked against data.

## Accessibility & Inclusion

WCAG 2.2 AA. The animated scene must respect prefers-reduced-motion, never hide text content, and
have a static fallback.
