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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Bookmark } from '@/lib/bookmarks';
import { Favicon, FaviconProps } from '@/lib/favicons';
import { TrashIcon } from 'lucide-react';
import { removeBookmarkAction } from './bookmarks-actions';

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
        <ContextMenu>
          <ContextMenuTrigger>
            <section className="transition-colors group-hover:bg-muted group-focus-visible:ring-1 group-focus-visible:ring-ring rounded-lg px-3 py-2">
              <header className="flex justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold">{bookmark.name}</h1>
                </div>
                <div className="text-muted-foreground text-sm">
                  Added on {dateFormatter.format(new Date(bookmark.createdAt))}
                </div>
              </header>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Favicon {...favicons[bookmark.url]} />
                {urlFormatter.format(bookmark.url)}
              </div>
            </section>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <AlertDialogTrigger asChild>
              <ContextMenuItem className="flex items-center gap-2">
                <TrashIcon size={16} /> Remove
              </ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
      </a>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove "{bookmark.name}" bookmark?
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
