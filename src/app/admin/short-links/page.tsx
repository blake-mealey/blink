import { listShortLinks } from '@/lib/short-links';
import { redis } from '@/lib/redis';
import { AddShortLinkForm } from './add-link-form';
import { adminSession } from '@/lib/session';
import { ShortLinksTable } from './short-links-table';
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
  const linksPage = await listShortLinks(redis, Number(page ?? 0), 50);

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Short links</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <AppContainer className="grid gap-6">
        <AddShortLinkForm />
        <ShortLinksTable linksPage={linksPage} />
      </AppContainer>
    </>
  );
}
