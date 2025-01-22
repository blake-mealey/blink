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
import { Link, LinksPage } from '@/lib/links';
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
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const dateFormatter = new Intl.DateTimeFormat();

const nameColumn: ColumnDef<Link, any> = {
  accessorKey: 'name',
  header: 'Name',
  cell: ({ getValue }) => {
    return (
      <div className="max-w-[100px] sm:max-w-[200px] md:max-w-[130px] lg:max-w-[200px] xl:max-w-[220px] text-nowrap overflow-hidden text-ellipsis">
        {getValue()}
      </div>
    );
  },
};

const urlColumn: ColumnDef<Link, any> = {
  accessorKey: 'url',
  header: 'URL',
  cell: ({ getValue }) => {
    return (
      <div className="max-w-[100px] sm:max-w-[320px] md:max-w-[140px] lg:max-w-[320px] xl:max-w-[550px] text-nowrap overflow-hidden text-ellipsis">
        {getValue()}
      </div>
    );
  },
};

const hitsColumn: ColumnDef<Link, any> = {
  accessorKey: 'hits',
  header: 'Hits',
};

const createdAtColumn: ColumnDef<Link, any> = {
  accessorKey: 'createdAt',
  header: 'Created',
  cell: ({ getValue }) => {
    return dateFormatter.format(new Date(getValue()));
  },
};

const actionsColumn: ColumnDef<Link, any> = {
  id: 'actions',
  cell: ({ row }) => {
    return <LinkActions linkName={row.getValue('name')} />;
  },
};

export function LinksTable({ linksPage }: { linksPage: LinksPage }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const table = useReactTable({
    data: linksPage.items,
    columns: isMobile
      ? [nameColumn, urlColumn, actionsColumn]
      : [nameColumn, urlColumn, hitsColumn, createdAtColumn, actionsColumn],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: linksPage.page,
        pageSize: linksPage.pageSize,
      },
    },
    manualPagination: true,
    rowCount: linksPage.itemsCount,
  });

  const setPage = (newPage: number) => {
    const search = new URLSearchParams({ page: newPage.toString() });
    router.push(pathname + '?' + search.toString());
  };

  return (
    <div>
      <div className="rounded-xl border">
        <Table>
          {isMobile ? (
            <colgroup>
              <col className="w-[220px]" />
              <col className="w-[550px]" />
              <col className="w-0" />
            </colgroup>
          ) : (
            <colgroup>
              <col className="w-[220px]" />
              <col className="w-[550px]" />
              <col className="w-0" />
              <col className="w-0" />
              <col className="w-0" />
            </colgroup>
          )}
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(linksPage.page - 1)}
          disabled={linksPage.page === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(linksPage.page + 1)}
          disabled={linksPage.page === linksPage.pagesCount - 1}
        >
          Next
        </Button>
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
