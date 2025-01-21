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
import { CopyIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
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
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const dateFormatter = new Intl.DateTimeFormat();

export function LinksTable({ links }: { links: Link[] }) {
  const table = useReactTable({
    data: links,
    columns: [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'url',
        header: 'URL',
      },
      {
        accessorKey: 'hits',
        header: 'Hits',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ getValue }) => {
          return dateFormatter.format(new Date(getValue()));
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return <LinkActions linkName={row.getValue('name')} />;
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No links.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LinkActions({ linkName }: { linkName: string }) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              copy(new URL(linkName, window.location.origin).toString())
            }
          >
            <CopyIcon /> Copy Short URL
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <TrashIcon /> Remove
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove "{linkName}" link?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data related to the link
            (including hits) will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={removeLinkAction}>
            <input type="hidden" name="name" value={linkName} />
            <AlertDialogAction type="submit">Remove</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
