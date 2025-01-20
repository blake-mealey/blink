import { getLink } from '@/lib/links';
import { redis } from '@/lib/redis';
import { notFound, redirect } from 'next/navigation';
import { track } from '@vercel/analytics/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const link = await getLink(redis, name);
  if (!link) {
    track('link-not-found', {
      linkName: name,
    });
    return notFound();
  }

  track('link-redirect', {
    linkName: name,
    linkUrl: link.url,
  });

  return redirect(link.url);
}
