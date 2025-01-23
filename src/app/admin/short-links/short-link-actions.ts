'use server';

import { addShortLink, removeShortLink } from '@/lib/short-links';
import { redis } from '@/lib/redis';
import { adminSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
);

export async function addShortLinkAction(formData: FormData) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const url = formData.get('url')?.toString();
  if (!url) {
    throw new Error('Missing form data field: url');
  }

  const nameType = formData.get('name-type')?.toString();
  if (nameType !== 'random' && nameType !== 'chosen') {
    throw new Error('Missing or invalid form data field: name-type');
  }

  let name: string;
  if (nameType === 'random') {
    name = nanoid();
  } else {
    const nameField = formData.get('name')?.toString();
    if (!nameField) {
      throw new Error('Missing form data field: name');
    }
    name = nameField;
  }

  await addShortLink(redis, {
    url,
    name,
    createdAt: new Date().toISOString(),
  });
  revalidatePath('/admin/links');
}

export async function removeShortLinkAction(formData: FormData) {
  'use server';

  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const name = formData.get('name')?.toString();
  if (!name) {
    throw new Error('Missing form data field: name');
  }

  await removeShortLink(redis, name);
  revalidatePath('/admin/links');
}
