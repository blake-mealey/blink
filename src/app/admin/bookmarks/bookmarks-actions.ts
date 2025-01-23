'use server';

import { addBookmark, removeBookmark, trackBookmarkHit } from '@/lib/bookmarks';
import { redis } from '@/lib/redis';
import { adminSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function addBookmarkAction(formData: FormData) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const url = formData.get('url')?.toString();
  if (!url) {
    throw new Error('Missing form data field: url');
  }

  const name = formData.get('name')?.toString();
  if (!name) {
    throw new Error('Missing form data field: name');
  }

  await addBookmark(redis, {
    url,
    name,
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
