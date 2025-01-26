import ogs from 'open-graph-scraper';
import { ImageObject, TwitterImageObject } from 'open-graph-scraper/types';

export interface ImageMeta {
  height: number | null;
  type: string | null;
  url: string;
  width: number | null;
  alt: string | null;
}

export interface GraphMeta {
  title: string | null;
  description: string | null;
  images: ImageMeta[];
  author: string | null;
  // TODO: more? just use their type?
}

export async function getGraphMeta(url: string): Promise<GraphMeta> {
  const meta = await ogs({ url });
  return {
    title:
      meta.result.ogTitle ??
      meta.result.twitterTitle ??
      meta.result.dcTitle ??
      meta.result.ogSiteName ??
      null,
    description:
      meta.result.ogDescription ??
      meta.result.twitterDescription ??
      meta.result.dcDescription ??
      null,
    author:
      meta.result.author ??
      meta.result.articleAuthor ??
      meta.result.ogArticleAuthor ??
      null,
    images: imageMeta(meta.result.ogImage ?? meta.result.twitterImage ?? []),
  };
}

function imageMeta(images: ImageObject[] | TwitterImageObject[]): ImageMeta[] {
  return images.map((x) => {
    return {
      url: x.url,
      alt: x.alt ?? null,
      width: x.width ?? null,
      height: x.height ?? null,
      type: 'type' in x ? x.type ?? null : null,
    };
  });
}
