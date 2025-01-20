import { Redis } from '@upstash/redis';

export interface Link {
  name: string;
  url: string;
  createdAt: string;
  hits?: number;
}

export interface LinksPage {
  items: Link[];
  cursor: string | number | undefined;
}

export async function listLinks(
  redis: Redis,
  cursor: number | string | undefined
): Promise<LinksPage> {
  // TODO: read to completion
  const [newCursor, fields] = await redis.zscan('@links', cursor ?? 0, {
    count: 1000,
  });

  if (fields.length > 0) {
    const [items, hits] = await Promise.all([
      redis.mget<Link[]>(fields.filter((x) => typeof x === 'string')),
      redis.mget<number[]>(
        fields
          .filter((x) => typeof x === 'string')
          .map((x) => x.replace(/^@link\//, '@link-hit/'))
      ),
    ]);
    for (let i = 0; i < items.length; i++) {
      items[i].hits = hits[i] ?? 0;
    }

    return {
      items,
      cursor: newCursor,
    };
  }

  return {
    items: [],
    cursor: undefined,
  };
}

export async function getLink(
  redis: Redis,
  name: string
): Promise<Link | null> {
  const key = `@link/${name}`;
  return redis.get<Link>(key);
}

export async function addLink(redis: Redis, link: Link) {
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

export async function removeLink(redis: Redis, name: string) {
  const key = `@link/${name}`;
  const p = redis.pipeline();
  p.del(key);
  p.zrem('@links', key);
  await p.exec();
}

export async function trackLinkHit(redis: Redis, name: string) {
  const key = `@link-hit/${name}`;
  await redis.incr(key);
}

export async function trackLinkMiss(redis: Redis, name: string) {
  const key = `@link-miss/${name}`;
  await redis.incr(key);
}
