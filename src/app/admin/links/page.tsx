import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listLinks, removeLink } from '@/lib/links';
import { redis } from '@/lib/redis';
import { AddLinkForm } from './add-link-form';
import { adminSession } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { revalidatePath } from 'next/cache';

const dateFormatter = new Intl.DateTimeFormat();

async function removeLinkAction(formData: FormData) {
  'use server';

  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const name = formData.get('name')?.toString();
  if (!name) {
    throw new Error('Missing form data field: name');
  }

  await removeLink(redis, name);
  revalidatePath('/admin/links');
}

export default async function LinksPage() {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const { items } = await listLinks(redis, undefined);

  return (
    <>
      <AddLinkForm />

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((link) => {
            if (!link) {
              return null;
            }
            return (
              <TableRow>
                <TableCell>{link.name}</TableCell>
                <TableCell>{link.url}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {dateFormatter.format(Date.parse(link.createdAt))}

                  <form action={removeLinkAction}>
                    <input type="hidden" name="name" value={link.name} />
                    <Button size="icon" variant="ghost">
                      <Trash />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
