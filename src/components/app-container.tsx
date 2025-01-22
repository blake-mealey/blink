import { cn } from '@/lib/utils';

export function AppContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn(className, 'max-w-screen-lg relative px-4')}>
      {children}
    </main>
  );
}
