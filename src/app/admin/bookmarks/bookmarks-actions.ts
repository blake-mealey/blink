'use server';

import {
  addBookmark,
  Bookmark,
  removeBookmark,
  trackBookmarkHit,
} from '@/lib/bookmarks';
import { getFaviconUrl } from '@/lib/favicons';
import { getGraphMeta } from '@/lib/graph-meta';
import { redis } from '@/lib/redis';
import { adminSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export type BookmarkPreviewResult =
  | {
      ok: true;
      preview: BookmarkPreview;
    }
  | {
      ok: false;
      error: string;
    };

export type BookmarkPreview = Pick<Bookmark, 'graphMeta' | 'faviconUrl'>;

export async function previewAddBookmarkAction(
  url: string
): Promise<BookmarkPreviewResult> {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  try {
    const [graphMeta, faviconUrl] = await Promise.all([
      getGraphMeta(url),
      getFaviconUrl(url, 64),
    ]);

    return {
      ok: true,
      preview: {
        graphMeta,
        faviconUrl,
      },
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        ok: false,
        error: e.message,
      };
    } else if ((e as any).result?.error) {
      return {
        ok: false,
        error: (e as any).result.error,
      };
    }
    throw e;
  }
}

export async function addBookmarkAction(formData: FormData) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const url = formData.get('url')?.toString();
  if (!url) {
    throw new Error('Missing form data field: url');
  }

  const notes = formData.get('notes')?.toString();

  const [graphMeta, faviconUrl] = await Promise.all([
    getGraphMeta(url),
    getFaviconUrl(url, 64),
  ]);

  await addBookmark(redis, {
    url,
    graphMeta,
    faviconUrl,
    notes: notes ?? '',
    createdAt: new Date().toISOString(),
  });
  revalidatePath('/admin/bookmarks');
}

export async function removeBookmarkAction(formData: FormData) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const url = formData.get('url')?.toString();
  if (!url) {
    throw new Error('Missing form data field: url');
  }

  await removeBookmark(redis, url);
  revalidatePath('/admin/bookmarks');
}

export async function trackBookmarkHitAction(url: string) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  await trackBookmarkHit(redis, url);
  revalidatePath('/admin/bookmarks');
}
