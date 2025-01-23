import { Redis } from '@upstash/redis';

export interface ShortLink {
  name: string;
  url: string;
  createdAt: string;
  hits?: number;
}

export interface ShortLinksPage {
  items: ShortLink[];
  page: number;
  pageSize: number;
  itemsCount: number;
  itemsRemainingCount: number;
  pagesCount: number;
  pagesRemainingCount: number;
}

export async function listShortLinks(
  redis: Redis,
  page: number,
  pageSize: number
): Promise<ShortLinksPage> {
  const start = page * pageSize;
  const end = start + pageSize - 1;

  const itemsCount = await redis.zcard('@links');
  const itemsRemainingCount = Math.max(0, itemsCount - end - 1);
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const pagesRemainingCount = Math.max(0, pagesCount - page - 1);

  const keys = await redis.zrange<string[]>('@links', start, end);

  if (keys.length > 0) {
    const [items, hits] = await Promise.all([
      redis.mget<ShortLink[]>(keys),
      redis.mget<number[]>(
        keys.map((x) => x.replace(/^@link\//, '@link-hit/'))
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

export async function getShortLink(
  redis: Redis,
  name: string
): Promise<ShortLink | null> {
  const key = `@link/${name}`;
  return redis.get<ShortLink>(key);
}

export async function addShortLink(redis: Redis, link: ShortLink) {
  const key = `@link/${link.name}`;
  const p = redis.pipeline();
  p.set(key, link, { nx: true });
  p.zadd(
    '@links',
    { nx: true },
    {
      member: key,
      score: Date.parse(link.createdAt),
    }
  );
  await p.exec();
}

export async function removeShortLink(redis: Redis, name: string) {
  const key = `@link/${name}`;
  const p = redis.pipeline();
  p.del(key);
  p.zrem('@links', key);
  await p.exec();
}

export async function trackShortLinkHit(redis: Redis, name: string) {
  const key = `@link-hit/${name}`;
  await redis.incr(key);
}

export async function trackShortLinkMiss(redis: Redis, name: string) {
  const key = `@link-miss/${name}`;
  await redis.incr(key);
}
