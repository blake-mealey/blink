import { listLinks } from '@/lib/links';
import { redis } from '@/lib/redis';
import { AddLinkForm } from './add-link-form';
import { adminSession } from '@/lib/session';
import { LinksTable } from './links-table';
import { AppHeader } from '@/components/app-header';
import { AppContainer } from '@/components/app-container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const session = adminSession();
  if (!session) {
    throw new Error('Not logged in');
  }

  const { page } = await searchParams;
  const linksPage = await listLinks(redis, Number(page ?? 0), 50);

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Links</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <AppContainer className="grid gap-6">
        <AddLinkForm />
        <LinksTable linksPage={linksPage} />
      </AppContainer>
    </>
  );
}
