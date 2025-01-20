'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@/lib/links';
import { Copy, Trash } from 'lucide-react';
import { removeLinkAction } from './link-actions';
import copy from 'copy-to-clipboard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const dateFormatter = new Intl.DateTimeFormat();

export function LinksTable({ links }: { links: Link[] }) {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Hits</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => {
          return (
            <TableRow key={link.name}>
              <TableCell className="flex items-center gap-2">
                {link.name}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    copy(new URL(link.name, window.location.origin).toString());
                  }}
                >
                  <Copy />
                </Button>
              </TableCell>
              <TableCell>{link.url}</TableCell>
              <TableCell>{link.hits ?? 0}</TableCell>
              <TableCell className="flex items-center gap-2">
                {dateFormatter.format(Date.parse(link.createdAt))}
                <RemoveLinkButton link={link} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function RemoveLinkButton({ link }: { link: Link }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove link?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data related to the link
            (including hits) will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={removeLinkAction}>
            <input type="hidden" name="name" value={link.name} />
            <AlertDialogAction type="submit">Remove</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
