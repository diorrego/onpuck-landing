import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { paper } from '@/content/paper';

export const alt = 'OnPuck light paper: an isometric pixel-art floor of simulated users at laptops, tablets, phones and smart speakers, next to the headline.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [poster, cmu] = await Promise.all([
    readFile(join(process.cwd(), 'public/scene/poster-2x.png')),
    readFile(join(process.cwd(), 'assets-og/cmu-serif-500-roman.ttf')),
  ]);
  const src = `data:image/png;base64,${poster.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#ffffff', color: '#171717', fontFamily: 'CMU Serif', position: 'relative' }}>
        <img src={src} width={864} height={560} alt="" style={{ position: 'absolute', left: 500, top: 92 }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 0 60px 64px', width: 560 }}>
          <div style={{ fontSize: 36 }}>OnPuck</div>
          <div style={{ fontSize: 58, lineHeight: 1.1 }}>{paper.hero.headline}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 24, color: '#525252' }}>{paper.hero.authors}</div>
            <div style={{ display: 'flex' }}>
              <span style={{ background: '#1d4ed8', color: '#ffffff', borderRadius: 10, padding: '10px 20px', fontSize: 22 }}>Apply to be a design partner</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'CMU Serif', data: cmu, weight: 400, style: 'normal' }] },
  );
}
