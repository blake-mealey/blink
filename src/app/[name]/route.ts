import { getLink } from '@/lib/links';
import { redis } from '@/lib/redis';
import { notFound, redirect } from 'next/navigation';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const link = await getLink(redis, name);
  if (!link) {
    return notFound();
  }

  return redirect(link.url);
}
