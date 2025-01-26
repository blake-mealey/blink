'use client';

import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bookmark, BookmarksPage } from '@/lib/bookmarks';
import { Favicon, FaviconProps } from '@/lib/favicons';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MoreHorizontalIcon, TrashIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { removeBookmarkAction } from './bookmarks-actions';

const dateFormatter = new Intl.DateTimeFormat();

export function BookmarksTable({
  bookmarksPage,
  favicons,
}: {
  bookmarksPage: BookmarksPage;
  favicons: Record<string, FaviconProps>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const nameColumn: ColumnDef<Bookmark, any> = {
    accessorKey: 'graphMeta',
    header: 'Title',
    cell: ({ getValue, row }) => {
      return (
        <a
          className="flex items-center gap-2"
          href={row.getValue('url')}
          target="_blank"
          rel="noopener"
        >
          <Favicon {...favicons[row.getValue('url') as string]} />
          <div className="max-w-[100px] sm:max-w-[200px] md:max-w-[130px] lg:max-w-[200px] xl:max-w-[220px] text-nowrap overflow-hidden text-ellipsis">
            {getValue()}
          </div>
        </a>
      );
    },
  };

  const urlColumn: ColumnDef<Bookmark, any> = {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="max-w-[100px] sm:max-w-[320px] md:max-w-[140px] lg:max-w-[320px] xl:max-w-[550px] text-nowrap overflow-hidden text-ellipsis">
            {getValue()}
          </span>
        </div>
      );
    },
  };

  const hitsColumn: ColumnDef<Bookmark, any> = {
    accessorKey: 'hits',
    header: 'Hits',
  };

  const createdAtColumn: ColumnDef<Bookmark, any> = {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => {
      return dateFormatter.format(new Date(getValue()));
    },
  };

  const actionsColumn: ColumnDef<Bookmark, any> = {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <LinkActions
          bookmarkName={row.getValue('graphMeta').title}
          bookmarkUrl={row.getValue('url')}
        />
      );
    },
  };

  const table = useReactTable({
    data: bookmarksPage.items,
    columns: isMobile
      ? [nameColumn, urlColumn, actionsColumn]
      : [nameColumn, urlColumn, hitsColumn, createdAtColumn, actionsColumn],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: bookmarksPage.page,
        pageSize: bookmarksPage.pageSize,
      },
    },
    manualPagination: true,
    rowCount: bookmarksPage.itemsCount,
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
                  No bookmarks.
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
          onClick={() => setPage(bookmarksPage.page - 1)}
          disabled={bookmarksPage.page === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(bookmarksPage.page + 1)}
          disabled={bookmarksPage.page === bookmarksPage.pagesCount - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function LinkActions({
  bookmarkName,
  bookmarkUrl,
}: {
  bookmarkName: string;
  bookmarkUrl: string;
}) {
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
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <TrashIcon /> Remove
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove "{bookmarkName}" bookmark?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data related to the bookmark
            (including hits) will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={removeBookmarkAction}>
            <input type="hidden" name="url" value={bookmarkUrl} />
            <AlertDialogAction type="submit">Remove</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
