import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { CTA_LABEL, paper } from '@/content/paper';

export const alt = 'OnPuck light paper: an isometric pixel-art floor of simulated users at laptops, tablets, phones and smart speakers, next to the headline.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The headline in three balanced lines (Satori has no text-wrap: balance).
const LINES = ['Know what your', 'users will do before', 'your agent builds it.'];

export default async function Image() {
  const root = process.cwd();
  const [poster, cmu, logo] = await Promise.all([
    readFile(join(root, 'public/scene/poster-og.png')),
    readFile(join(root, 'assets-og/cmu-serif-500-roman.ttf')),
    readFile(join(root, 'assets-og/puck-line.svg'), 'utf8'),
  ]);
  const scene = `data:image/png;base64,${poster.toString('base64')}`;
  const mark = `data:image/svg+xml;base64,${Buffer.from(logo.replace('fill="currentColor"', 'fill="#171717"')).toString('base64')}`;
  if (LINES.join(' ') !== paper.hero.headline) throw new Error('OG headline lines are out of sync with the hero');

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#ffffff', color: '#171717', fontFamily: 'CMU Serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 0 56px 64px', width: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={mark} width={72} height={72} alt="" />
            <span style={{ fontSize: 44 }}>OnPuck</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 46, lineHeight: 1.16 }}>
            {LINES.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ fontSize: 24, color: '#525252' }}>{paper.hero.authors}</span>
            <div style={{ display: 'flex' }}>
              <span style={{ background: '#1d4ed8', color: '#ffffff', borderRadius: 10, padding: '10px 22px', fontSize: 22 }}>{CTA_LABEL}</span>
            </div>
          </div>
        </div>
        {/* the whole scene in its own column, never under the text */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 20 }}>
          <img src={scene} width={648} height={420} alt="" />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'CMU Serif', data: cmu, weight: 400, style: 'normal' }] },
  );
}
