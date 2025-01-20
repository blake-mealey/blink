import { listLinks } from '@/lib/links';
import { redis } from '@/lib/redis';
import { AddLinkForm } from './add-link-form';
import { adminSession } from '@/lib/session';
import { LinksTable } from './links-table';

export default async function LinksPage() {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const { items } = await listLinks(redis, undefined);

  return (
    <div className="grid gap-6">
      <AddLinkForm />

      <LinksTable links={items} />
    </div>
  );
}
