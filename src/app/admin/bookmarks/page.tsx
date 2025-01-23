import { AppContainer } from '@/components/app-container';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { AddBookmarkForm } from './add-bookmark-form';
import { BookmarksTable } from './bookmarks-table';
import { adminSession } from '@/lib/session';
import { listBookmarks } from '@/lib/bookmarks';
import { redis } from '@/lib/redis';
import { FaviconProps, getFaviconProps } from '@/lib/favicons';

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const { page } = await searchParams;
  const bookmarksPage = await listBookmarks(redis, Number(page ?? 0), 50);

  const urls = Array.from(new Set(bookmarksPage.items.map((x) => x.url)));
  const favicons = Object.fromEntries(
    await Promise.all(
      urls.map(
        async (x): Promise<[string, FaviconProps]> => [
          x,
          await getFaviconProps(x, 16),
        ]
      )
    )
  );

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Bookmarks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <AppContainer className="grid gap-6">
        <AddBookmarkForm />
        <BookmarksTable bookmarksPage={bookmarksPage} favicons={favicons} />
      </AppContainer>
    </>
  );
}
