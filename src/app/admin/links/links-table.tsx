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

const dateFormatter = new Intl.DateTimeFormat();

export function LinksTable({ links }: { links: Link[] }) {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
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
  );
}
