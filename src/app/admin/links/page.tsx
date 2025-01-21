import { listLinks } from '@/lib/links';
import { redis } from '@/lib/redis';
import { AddLinkForm } from './add-link-form';
import { adminSession } from '@/lib/session';
import { LinksTable } from './links-table';

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const { page } = await searchParams;
  const linksPage = await listLinks(redis, Number(page ?? 0), 50);

  return (
    <div className="grid gap-6">
      <AddLinkForm />

      <LinksTable linksPage={linksPage} />
    </div>
  );
}
