import {
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  Sidebar,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { adminSession, endAdminSession } from '@/lib/session';
import Link from 'next/link';
import { AdminLogin } from './admin-login';
import { BookmarkIcon, LinkIcon, LogOutIcon, WrenchIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
      <Sidebar variant="floating">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Blink</SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/bookmarks">
                    <BookmarkIcon />
                    <span>Bookmarks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/short-links">
                    <LinkIcon />
                    <span>Short links</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/settings">
                    <WrenchIcon />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <form action={logoutAction}>
                <SidebarMenuButton>
                  <LogOutIcon />
                  <span>Logout</span>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
