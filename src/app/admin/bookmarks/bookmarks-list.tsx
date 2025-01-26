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
import { Bookmark } from '@/lib/bookmarks';
import { Favicon, FaviconProps } from '@/lib/favicons';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { removeBookmarkAction } from './bookmarks-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const dateFormatter = new Intl.DateTimeFormat();

// TODO: auto-paginate
export function BookmarksList({
  bookmarks,
  favicons,
}: {
  bookmarks: Bookmark[];
  favicons: Record<string, FaviconProps>;
}) {
  return (
    <div className="flex flex-col gap-1">
      {bookmarks.map((bookmark) => {
        return (
          <BookmarksListItem
            key={bookmark.url}
            bookmark={bookmark}
            favicons={favicons}
          />
        );
      })}
    </div>
  );
}

const urlFormatter = {
  format(url: string) {
    return new URL(url).hostname;
  },
};

function BookmarksListItem({
  bookmark,
  favicons,
}: {
  bookmark: Bookmark;
  favicons: Record<string, FaviconProps>;
}) {
  return (
    <AlertDialog>
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener"
        className="group focus-visible:outline-none"
      >
        <section className="transition-colors group-hover:bg-muted group-focus-visible:ring-1 group-focus-visible:ring-ring rounded-lg px-3 py-2 flex flex-col gap-2">
          <header>
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">{bookmark.graphMeta.title}</h1>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground text-sm font-medium text-nowrap">
                  Added on {dateFormatter.format(new Date(bookmark.createdAt))}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <TrashIcon size={16} /> Remove
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Favicon src={bookmark.faviconUrl} />
              {urlFormatter.format(bookmark.url)}
            </div>
          </header>

          <div className="text-muted-foreground">
            {bookmark.graphMeta.description}
          </div>
          {bookmark.notes ? (
            <div className="flex items-start gap-2">
              <PencilIcon size={16} className="mt-1" />
              <p className="text-muted-foreground">{bookmark.notes}</p>
            </div>
          ) : null}
        </section>
      </a>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove "{bookmark.graphMeta.title}" bookmark?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data related to the bookmark
            (including hits) will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={removeBookmarkAction}>
            <input type="hidden" name="url" value={bookmark.url} />
            <AlertDialogAction type="submit">Remove</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
