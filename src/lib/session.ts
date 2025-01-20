import { cookies } from 'next/headers';
import Iron, { SealOptions } from '@hapi/iron';
import { Redis } from '@upstash/redis';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'blink_admin_sess';

const IronOptions: SealOptions = {
  encryption: Iron.defaults.encryption,
  integrity: Iron.defaults.integrity,
  ttl: 1000 * 60 * 60 * 24 * 7, // 1 week
  localtimeOffsetMsec: 0,
  timestampSkewSec: 60,
};

function sessionSecret() {
  const secret = process.env.BLINK_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error('missing required BLINK_SESSION_SECRET env var');
  }
  return secret;
}

export interface AdminSession {}

export async function adminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie) {
    return null;
  }

  try {
    const session: AdminSession = await Iron.unseal(
      cookie.value,
      sessionSecret(),
      IronOptions
    );
    return session;
  } catch {
    return null;
  }
}

const ADMIN_PASSWORD_KEY = '@admin-password';

export async function isAdminPasswordConfigured(redis: Redis) {
  const existing = await redis.get<string>(ADMIN_PASSWORD_KEY);
  return existing !== null;
}

export async function createAdminPassword(redis: Redis, password: string) {
  const existing = await redis.get<string>(ADMIN_PASSWORD_KEY);
  if (existing !== null) {
    throw new Error('Admin password has already been configured.');
  }

  await redis.set(ADMIN_PASSWORD_KEY, bcrypt.hashSync(password, 10));
}

export async function createAdminSession(
  redis: Redis,
  password: string
): Promise<AdminSession> {
  const correct = await redis.get<string>(ADMIN_PASSWORD_KEY);
  if (correct === null) {
    throw new Error('Admin password has not yet been configured.');
  }

  if (!bcrypt.compareSync(password, correct)) {
    throw new Error('Admin password is incorrect.');
  }

  const session: AdminSession = {};
  const cookieVal = await Iron.seal(session, sessionSecret(), IronOptions);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, cookieVal, {
    httpOnly: true,
    maxAge: IronOptions.ttl / 1000,
    path: '/',
    sameSite: 'strict',
    secure: true,
  });

  return session;
}

export async function changeAdminPassword(redis: Redis, password: string) {
  const existing = await redis.get<string>(ADMIN_PASSWORD_KEY);
  if (existing === null) {
    throw new Error('Admin password has not yet been configured.');
  }

  await redis.set(ADMIN_PASSWORD_KEY, bcrypt.hashSync(password, 10));
}

export async function endAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return redirect('/');
}
