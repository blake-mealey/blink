export interface FaviconProps {
  src: string;
  size: number;
}

export async function getFaviconProps(
  url: string,
  size: number
): Promise<FaviconProps> {
  const res = await fetch(
    `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(
      url
    )}&sz=${size * 4}`
  );
  return {
    src: res.url,
    size,
  };
}

export function Favicon({ src, size }: FaviconProps) {
  return <img src={src} width={size} height={size} alt="favicon" />;
}
