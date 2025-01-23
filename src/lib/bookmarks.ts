import { Redis } from '@upstash/redis';

export interface Bookmark {
  url: string;
  name: string;
  createdAt: string;
  hits?: number;
}

export interface BookmarksPage {
  items: Bookmark[];
  page: number;
  pageSize: number;
  itemsCount: number;
  itemsRemainingCount: number;
  pagesCount: number;
  pagesRemainingCount: number;
}

export async function listBookmarks(
  redis: Redis,
  page: number,
  pageSize: number
): Promise<BookmarksPage> {
  const start = page * pageSize;
  const end = start + pageSize - 1;

  const itemsCount = await redis.zcard('@bookmarks');
  const itemsRemainingCount = Math.max(0, itemsCount - end - 1);
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const pagesRemainingCount = Math.max(0, pagesCount - page - 1);

  const keys = await redis.zrange<string[]>('@bookmarks', start, end);

  if (keys.length > 0) {
    const [items, hits] = await Promise.all([
      redis.mget<Bookmark[]>(keys),
      redis.mget<number[]>(
        keys.map((x) => x.replace(/^@bookmark\//, '@bookmark-hit/'))
      ),
    ]);
    for (let i = 0; i < items.length; i++) {
      items[i].hits = hits[i] ?? 0;
    }

    return {
      items,
      page,
      pageSize,
      itemsCount,
      itemsRemainingCount,
      pagesCount,
      pagesRemainingCount,
    };
  }

  return {
    items: [],
    page,
    pageSize,
    itemsCount,
    itemsRemainingCount,
    pagesCount,
    pagesRemainingCount,
  };
}

export async function addBookmark(redis: Redis, bookmark: Bookmark) {
  const key = `@bookmark/${bookmark.url}`;
  const p = redis.pipeline();
  p.set(key, bookmark, { nx: true });
  p.zadd(
    '@bookmarks',
    { nx: true },
    {
      member: key,
      score: Date.parse(bookmark.createdAt),
    }
  );
  await p.exec();
}

export async function removeBookmark(redis: Redis, url: string) {
  const key = `@bookmark/${url}`;
  const p = redis.pipeline();
  p.del(key);
  p.zrem('@bookmarks', key);
  await p.exec();
}

export async function trackBookmarkHit(redis: Redis, url: string) {
  const key = `@bookmark-hit/${url}`;
  await redis.incr(key);
}
