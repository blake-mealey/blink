import { AppContainer } from '@/components/app-container';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
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
import { adminSession, changeAdminPassword } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function changeAdminPasswordAction(formData: FormData) {
  'use server';

  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const password = formData.get('password')?.toString();
  if (!password) {
    throw new Error('Missing required field: password');
  }

  await changeAdminPassword(redis, password);
  revalidatePath('/admin');
}

export default async function SettingsPage() {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <AppContainer className="grid gap-6">
        <ChangeAdminPassword />
      </AppContainer>
    </>
  );
}

function ChangeAdminPassword() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change admin password</CardTitle>
        <CardDescription>
          Enter a password that you will use to login in the future.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={changeAdminPasswordAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button>Change Password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
