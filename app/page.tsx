'use client';

import * as z from 'zod';
import { useState, ChangeEvent } from 'react';

export default function Home() {
  const emailSchema = z.email({
    error: 'Please enter a valid email address.',
  });
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'invalid' | 'success' | 'error'
  >('idle');

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSubmitStatus('idle');
  };

  const emailIsValid = emailSchema.safeParse(email).success;

  const joinWaitlistButtonHandler = async () => {
    if (!emailIsValid) {
      setSubmitStatus('invalid');
      return;
    }

    setSubmitStatus('idle');

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL!,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `New waitlist signup: ${email}`,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      } else {
        setSubmitStatus('success');
        setEmail('');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Hero */}
      <section className="px-4 pb-24">
        <p className="pt-12 text-center text-sm text-white/60 tracking-widest uppercase">
          OnPuck | Agentic Customer Development
        </p>

        <h1 className="pt-12 md:pt-20 text-2xl md:text-4xl px-2 md:px-0 md:max-w-2xl text-center mx-auto text-balance">
          Agents that investigate human stories using real data, code, and
          systems.
        </h1>

        <h2 className="mt-8 max-w-xl mx-auto text-center text-white/70 text-base md:text-lg leading-relaxed text-balance">
          We turn a startup’s customer interviews into actionable evidence by
          connecting them with their data and systems.
        </h2>

        <div className="flex flex-col w-full mt-12 max-w-lg mx-auto">
          <div className="w-full flex flex-col sm:flex-row gap-3 justify-center items-center max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={onChangeHandler}
              placeholder="you@startup.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 placeholder:text-white/40"
            />
            <button
              className={`w-full md:max-w-44 px-6 py-3 text-black rounded-lg text-sm font-medium hover:bg-white/90 transition ${!email || emailIsValid ? 'bg-white' : 'bg-white/80'}`}
              onClick={joinWaitlistButtonHandler}
            >
              Join waitlist
            </button>
          </div>
          <p
            className={`mt-2 text-xs ${submitStatus === 'invalid' || submitStatus === 'error' ? 'text-red-300' : ''} ${submitStatus === 'success' ? 'text-green-300' : ''}`}
          >
            {submitStatus === 'invalid'
              ? 'Please enter a valid email address.'
              : ''}
            {submitStatus === 'success'
              ? `You're on the waitlist. We'll be in touch soon.`
              : ''}
            {submitStatus === 'error'
              ? 'Something went wrong. Please reload the page and try again.'
              : ''}
            <span className="text-black">{' .'}</span>
          </p>
        </div>
      </section>

      {/* How it works – MVP */}
      <section className="px-4 py-24 border-t border-white/10">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-sm text-white/50 mb-12 tracking-widest uppercase">
            How it works
          </p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="text-white/40 text-sm pt-1">01</div>
              <div>
                <h3 className="text-lg mb-1">
                  Connects to your data and systems
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Hooks into the stack you already run and ties user stories to
                  real product data.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <img src="/github-dark.svg" alt="GitHub" className="h-5" />
                  <img src="/sentry.svg" alt="Sentry" className="h-5" />
                  <img src="/posthog.svg" alt="PostHog" className="h-5" />
                  <img
                    src="/aws-amazon-cloudwatch.svg"
                    alt="CloudWatch"
                    className="h-5"
                  />
                  <img src="/axiom.svg" alt="Axiom" className="h-5" />
                  <img src="/postgresql.svg" alt="Postgres" className="h-5" />
                  <img src="/mongodb.svg" alt="MongoDB" className="h-5" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="text-white/40 text-sm pt-1">02</div>
              <div>
                <h3 className="text-lg mb-1">Interviews</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  A multi-agent system runs customer interviews over Google
                  Meet, or you upload the interviews and transcripts you already
                  have.
                </p>
                <img src="/google-meet.svg" alt="Google Meet" className="h-5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="text-white/40 text-sm pt-1">03</div>
              <div>
                <h3 className="text-lg mb-1">
                  Specs your coding agent can ship
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Turns that into a clear product spec of what to build or fix
                  next, grounded in user stories and live system data, ready for
                  a coding agent to pick up.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <img
                    src="/claude-code.svg"
                    alt="Claude Code"
                    className="h-5"
                  />
                  <img src="/codex-dark.svg" alt="Codex" className="h-5" />
                  <img src="/cursor.svg" alt="Cursor" className="h-5" />
                  <img src="/opencode.svg" alt="Open Code" className="h-5" />
                  <img src="/kimi.svg" alt="Kimi" className="h-5" />
                  <img
                    src="/github-copilot.svg"
                    alt="GitHub Copilot"
                    className="h-5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Path to launch */}
      <section className="px-4 py-24 border-t border-white/10">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-sm text-white/50 mb-16 tracking-widest uppercase">
            Path to launch
          </p>

          <div className="space-y-12">
            <div className="flex gap-6">
              <span className="w-16 shrink-0 text-white/40 text-sm pt-0.5">
                Sep 28
              </span>
              <div>
                <h3 className="text-lg mb-1">Internal experiment ends</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Finish testing the system on our own product -{' '}
                  <a
                    href="https://woku.app/en"
                    target="_blank"
                    className="underline"
                  >
                    woku.app
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="w-16 shrink-0 text-white/40 text-sm pt-0.5">
                Oct 19
              </span>
              <div>
                <h3 className="text-lg mb-1">5 SF startups</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Recruit and select 5 San Francisco startups that want to
                  insert manual transcripts and let our agents tell them what to
                  build and improve.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="w-16 shrink-0 text-white/40 text-sm pt-0.5">
                Nov 16
              </span>
              <div>
                <h3 className="text-lg mb-1">Full system test</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Recruit 5 more startups to test the complete system with
                  automatic Google Meet interviews.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="w-16 shrink-0 text-white/40 text-sm pt-0.5">
                Dec 07
              </span>
              <div>
                <h3 className="text-lg mb-1">Launch</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Open beta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
