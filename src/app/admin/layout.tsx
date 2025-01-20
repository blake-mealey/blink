import {
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  Sidebar,
} from '@/components/ui/sidebar';
import { adminSession, endAdminSession } from '@/lib/session';
import Link from 'next/link';
import { AdminLogin } from './admin-login';

async function logoutAction() {
  'use server';

  return endAdminSession();
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await adminSession();

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/links">Links</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/settings">Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <form action={logoutAction}>
                <SidebarMenuButton>Logout</SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  );
}
