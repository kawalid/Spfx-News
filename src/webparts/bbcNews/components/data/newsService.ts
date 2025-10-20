import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching'; // ⬅️ important: enables .batched()
import { NewsCard } from '../BbcNews.types';
import { mapPageToCard } from './mapPageToCard';

interface SharePointPageItem {
  Id: number;
  Title: string;
  FileRef: string;
  BannerImageUrl?: {
    Url: string;
  };
  Description?: string;
  FirstPublishedDate?: string;
  PromotedState: number;
}

export async function getNewsByIds(sp: SPFI, ids: string[]): Promise<NewsCard[]> {
  if (!ids?.length) return [];

  const [batchedWeb, execute] = sp.web.batched(); // using your working batching pattern
  const results: Array<SharePointPageItem | null> = new Array(ids.length);

  ids.forEach((id, idx) => {
    batchedWeb.lists.getByTitle('Site Pages').items.getById(Number(id))
      .select('Id,Title,FileRef,BannerImageUrl,Description,FirstPublishedDate,PromotedState')()
      .then((i: SharePointPageItem) => { results[idx] = i; })
      .catch(() => { results[idx] = null; });
  });

  await execute();

  // keep only PromotedState == 2
  return results
    .filter((i): i is SharePointPageItem => i !== null && i.PromotedState === 2)
    .map(mapPageToCard);
}

export async function getLatestNews(sp: SPFI, top: number): Promise<NewsCard[]> {
  const items = await sp.web.lists.getByTitle('Site Pages').items
    .select('Id,Title,FileRef,BannerImageUrl,Description,FirstPublishedDate,PromotedState')
    .filter('PromotedState eq 2')               // ⬅️ news only
    .orderBy('FirstPublishedDate', false)
    .top(top)();

  return (items as SharePointPageItem[]).map(mapPageToCard);
}
