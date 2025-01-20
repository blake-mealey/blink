import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redis } from '@/lib/redis';
import {
  createAdminPassword,
  createAdminSession,
  isAdminPasswordConfigured,
} from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function AdminLogin() {
  const hasPassword = await isAdminPasswordConfigured(redis);

  const form = hasPassword ? <EnterAdminPassword /> : <CreateAdminPassword />;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{form}</div>
    </div>
  );
}

async function loginAction(formData: FormData) {
  'use server';

  const password = formData.get('password')?.toString();
  if (!password) {
    throw new Error('Missing required field: password');
  }
  await createAdminSession(redis, password);
  revalidatePath('/admin');
}

function EnterAdminPassword() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin login</CardTitle>
        <CardDescription>Enter the admin password to login.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={loginAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button>Login</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

async function createAdminPasswordAction(formData: FormData) {
  'use server';

  const password = formData.get('password')?.toString();
  if (!password) {
    throw new Error('Missing required field: password');
  }
  await createAdminPassword(redis, password);
  revalidatePath('/admin');
}

function CreateAdminPassword() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create admin password</CardTitle>
        <CardDescription>
          Enter a password that you will use to login in the future.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createAdminPasswordAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button>Create Password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
