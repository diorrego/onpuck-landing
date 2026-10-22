import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { paper } from '@/content/paper';

export const alt = 'onpuck light paper: an isometric pixel-art floor of simulated users at laptops, tablets, phones and smart speakers, next to the headline.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function font(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const poster = await readFile(join(process.cwd(), 'public/scene/poster-2x.png'));
  const src = `data:image/png;base64,${poster.toString('base64')}`;
  const headline = paper.hero.headline;
  const small = 'A light paper · Design partner program';
  const [bold, regular] = await Promise.all([font(800, headline + 'onpuck'), font(500, small)]);
  const fonts = [
    ...(bold ? [{ name: 'Schibsted', data: bold, weight: 800 as const, style: 'normal' as const }] : []),
    ...(regular ? [{ name: 'Schibsted', data: regular, weight: 500 as const, style: 'normal' as const }] : []),
  ];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f2f4f7', color: '#12141c', fontFamily: 'Schibsted', position: 'relative' }}>
        <img src={src} width={864} height={560} alt="" style={{ position: 'absolute', left: 500, top: 92 }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 0 56px 64px', width: 560 }}>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em' }}>onpuck</div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.035em', width: 440 }}>{headline}</div>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 500, color: '#464b60' }}>
            <span style={{ background: '#9ef0ff', border: '3px solid #12141c', padding: '6px 14px', whiteSpace: 'nowrap', boxShadow: '4px 4px 0 #12141c' }}>{small}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
