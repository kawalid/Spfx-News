/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-return-assign */
import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching'; // ⬅️ important: enables .batched()
import { NewsCard } from '../BbcNews.types';
import { mapPageToCard } from './mapPageToCard';

export interface FieldMappings {
  titleField?: string;
  descriptionField?: string;
  imageField?: string;
  dateField?: string;
  urlField?: string;
}

export async function getNewsByIds(
  sp: SPFI, 
  ids: string[], 
  listName: string = 'Site Pages', 
  usePromotedStateFilter: boolean = true,
  fieldMappings?: FieldMappings
): Promise<NewsCard[]> {
  if (!ids?.length) return [];

  const [batchedWeb, execute] = sp.web.batched();
  const results: any[] = new Array(ids.length);

  // Build select fields based on field mappings and filter configuration
  const fields = [
    'Id',
    fieldMappings?.titleField || 'Title',
    fieldMappings?.urlField || 'FileRef',
    fieldMappings?.imageField || 'BannerImageUrl',
    fieldMappings?.descriptionField || 'Description',
    fieldMappings?.dateField || 'FirstPublishedDate'
  ];
  
  if (usePromotedStateFilter) {
    fields.push('PromotedState');
  }
  
  const selectFields = fields.join(',');

  ids.forEach((id, idx) => {
    batchedWeb.lists.getByTitle(listName).items.getById(Number(id))
      .select(selectFields)()
      .then(i => results[idx] = i)
      .catch(() => results[idx] = null);
  });

  await execute();

  // Filter by PromotedState only if enabled
  const filtered = usePromotedStateFilter
    ? results.filter((i: any) => i && i.PromotedState === 2)
    : results.filter((i: any) => i);

  return filtered.map(item => mapPageToCard(item, fieldMappings));
}

export async function getLatestNews(
  sp: SPFI, 
  top: number, 
  listName: string = 'Site Pages', 
  usePromotedStateFilter: boolean = true,
  fieldMappings?: FieldMappings
): Promise<NewsCard[]> {
  // Build select fields based on field mappings and filter configuration
  const fields = [
    'Id',
    fieldMappings?.titleField || 'Title',
    fieldMappings?.urlField || 'FileRef',
    fieldMappings?.imageField || 'BannerImageUrl',
    fieldMappings?.descriptionField || 'Description',
    fieldMappings?.dateField || 'FirstPublishedDate'
  ];
  
  if (usePromotedStateFilter) {
    fields.push('PromotedState');
  }
  
  const selectFields = fields.join(',');

  let query = sp.web.lists.getByTitle(listName).items
    .select(selectFields);

  // Apply PromotedState filter only if enabled
  if (usePromotedStateFilter) {
    query = query.filter('PromotedState eq 2');
  }

  const dateFieldName = fieldMappings?.dateField || 'FirstPublishedDate';
  const items = await query
    .orderBy(dateFieldName, false)
    .top(top)();

  return items.map(item => mapPageToCard(item, fieldMappings));
}



