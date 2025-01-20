import { Redis } from '@upstash/redis';

export interface Link {
  name: string;
  url: string;
  createdAt: string;
}

export interface LinksPage {
  items: Link[];
  cursor: string | number | undefined;
}

export async function listLinks(
  redis: Redis,
  cursor: number | string | undefined
): Promise<LinksPage> {
  const [newCursor, fields] = await redis.zscan('@links', cursor ?? 0, {
    count: 50,
  });

  if (fields.length > 0) {
    const items = await redis.mget<Link[]>(
      fields.filter((x) => typeof x === 'string')
    );
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
  await redis.set(key, link, { nx: true });
  await redis.zadd('@links', {
    member: key,
    score: Date.parse(link.createdAt),
  });
}

export async function removeLink(redis: Redis, name: string) {
  const key = `@link/${name}`;
  await redis.del(key);
  await redis.zrem('@links', key);
}
