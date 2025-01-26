export interface FaviconProps {
  src: string;
  size?: number;
}

export async function getFaviconUrl(
  url: string,
  size: number
): Promise<string> {
  const res = await fetch(
    `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(
      url
    )}&sz=${size}`
  );
  return res.url;
}

export async function getFaviconProps(
  url: string,
  size: number
): Promise<FaviconProps> {
  const src = await getFaviconUrl(url, size * 4);
  return {
    src,
    size,
  };
}

export function Favicon({ src, size }: FaviconProps) {
  return <img src={src} width={size ?? 16} height={size ?? 16} alt="favicon" />;
}
