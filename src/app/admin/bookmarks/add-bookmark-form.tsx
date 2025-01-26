'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  addBookmarkAction,
  BookmarkPreview,
  previewAddBookmarkAction,
} from './bookmarks-actions';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';
import { Favicon } from '@/lib/favicons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type PreviewStatus =
  | 'empty'
  | 'invalid'
  | 'none'
  | 'loading'
  | 'not-found'
  | 'ready';

export function AddBookmarkForm() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<BookmarkPreview | null>(null);
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>('empty');

  const toggleOpen = (newState: boolean) => {
    setOpen(newState);
    if (!newState) {
      setPreview(null);
      setPreviewStatus('empty');
    }
  };

  const updatePreview = async (url: string) => {
    if (!url) {
      setPreviewStatus('empty');
      return;
    }

    try {
      // check if URL is valid before continuing
      new URL(url);

      setPreviewStatus('loading');
      setPreview(null);

      const result = await previewAddBookmarkAction(url);
      if (result.ok) {
        setPreview(result.preview);
        if (
          result.preview.graphMeta.title ||
          result.preview.graphMeta.description ||
          result.preview.graphMeta.images.length
        ) {
          setPreviewStatus('ready');
        } else {
          setPreviewStatus('none');
        }
      } else if (result.error.includes('404')) {
        setPreviewStatus('not-found');
      }
    } catch {
      setPreview(null);
      setPreviewStatus('invalid');
    }
  };

  const previewView = useMemo(() => {
    switch (previewStatus) {
      case 'empty':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <ImageIcon />
            <span className="mt-4 text-sm">No preview available</span>
            <span className="text-sm text-muted-foreground">
              Enter a URL to view a preview.
            </span>
          </div>
        );
      case 'invalid':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <ImageIcon />
            <span className="mt-4 text-sm">No preview available</span>
            <span className="text-sm text-muted-foreground">
              The provided URL is invalid.
            </span>
          </div>
        );
      case 'none':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <ImageIcon />
            <span className="mt-4 text-sm">No preview available</span>
            <span className="text-sm text-muted-foreground">
              The provided URL has no metadata.
            </span>
          </div>
        );
      case 'not-found':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <ImageIcon />
            <span className="mt-4 text-sm font-medium">
              No preview available
            </span>
            <span className="text-sm text-muted-foreground">
              The provided URL could not be found.
            </span>
          </div>
        );
      case 'loading':
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Skeleton className="h-[16px] w-[16px]" />
                <Skeleton className="h-[16px] w-[70%]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-[40px] w-full" />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </>
        );
      case 'ready':
        if (!preview) {
          return null;
        }
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Favicon src={preview.faviconUrl} />
                {preview.graphMeta.title}
              </CardTitle>
              <CardDescription>{preview.graphMeta.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {preview.graphMeta.images[0] ? (
                <img src={preview.graphMeta.images[0].url} />
              ) : null}
            </CardContent>
          </>
        );
    }
  }, [preview, previewStatus]);

  return (
    <Card
      className={cn('grid grid-cols-[minmax(0, 1fr)_0]', {
        'grid-cols-2': open,
      })}
    >
      <div>
        <Accordion
          type="multiple"
          value={open ? ['1'] : []}
          onValueChange={(x) => toggleOpen(x.includes('1'))}
        >
          <AccordionItem value="1" className="border-none">
            <AccordionTrigger
              arrow={false}
              className="rounded-xl data-[state=open]:rounded-b-none data-[state=open]:rounded-tr-none hover:no-underline hover:bg-secondary py-0"
            >
              <CardHeader>
                <CardTitle>Add new bookmark</CardTitle>
                <CardDescription>
                  Add a new bookmark to your collection.
                </CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <form
                  className="mt-2"
                  action={(formData) => {
                    setPreview(null);
                    setPreviewStatus('empty');
                    return addBookmarkAction(formData);
                  }}
                >
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        required
                        placeholder="https://example.com"
                        onChange={(e) => updatePreview(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="grid gap-2">
                      {/* TODO: textarea */}
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" name="notes" />
                    </div>

                    <Button>Add</Button>
                  </div>
                </form>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="bg-secondary rounded-r-xl border-l border-border flex flex-col">
        {open ? previewView : null}
      </div>
    </Card>
  );
}
