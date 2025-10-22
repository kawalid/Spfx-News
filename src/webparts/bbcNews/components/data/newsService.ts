/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-return-assign */
import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching'; // ⬅️ important: enables .batched()
import { NewsCard } from '../BbcNews.types';
import { mapPageToCard, mapItemToCard, FieldMapping } from './mapPageToCard';

export interface DataSourceConfig {
  listName: string;
  titleField: string;
  imageField: string;
  descriptionField: string;
  dateField: string;
  filterField?: string;
  filterValue?: string;
  sortField: string;
  sortDescending: boolean;
}

export async function getNewsByIds(
  sp: SPFI, 
  ids: string[], 
  config?: DataSourceConfig
): Promise<NewsCard[]> {
  if (!ids?.length) return [];
  
  // Use defaults if no config provided
  const listName = config?.listName || 'Site Pages';
  const mapping: FieldMapping = {
    titleField: config?.titleField || 'Title',
    imageField: config?.imageField || 'BannerImageUrl',
    descriptionField: config?.descriptionField || 'Description',
    dateField: config?.dateField || 'FirstPublishedDate',
  };
  
  const fields = ['Id', 'FileRef', mapping.titleField, mapping.imageField, mapping.descriptionField, mapping.dateField];
  if (config?.filterField) fields.push(config.filterField);

  const [batchedWeb, execute] = sp.web.batched(); // using your working batching pattern
  const results: any[] = new Array(ids.length);

  ids.forEach((id, idx) => {
    batchedWeb.lists.getByTitle(listName).items.getById(Number(id))
      .select(...fields)()
      .then(i => results[idx] = i)
      .catch(() => results[idx] = null);
  });

  await execute();

  // Filter if needed
  const filtered = config?.filterField && config?.filterValue
    ? results.filter((i: any) => i && String(i[config.filterField!]) === config.filterValue)
    : results.filter(Boolean);

  return filtered.map(i => config ? mapItemToCard(i, mapping) : mapPageToCard(i));
}

export async function getLatestNews(
  sp: SPFI, 
  top: number, 
  config?: DataSourceConfig
): Promise<NewsCard[]> {
  // Use defaults if no config provided
  const listName = config?.listName || 'Site Pages';
  const mapping: FieldMapping = {
    titleField: config?.titleField || 'Title',
    imageField: config?.imageField || 'BannerImageUrl',
    descriptionField: config?.descriptionField || 'Description',
    dateField: config?.dateField || 'FirstPublishedDate',
  };
  
  const fields = ['Id', 'FileRef', mapping.titleField, mapping.imageField, mapping.descriptionField, mapping.dateField];
  if (config?.filterField) fields.push(config.filterField);
  
  const sortField = config?.sortField || 'FirstPublishedDate';
  const sortDescending = config?.sortDescending !== undefined ? config.sortDescending : true;

  let query = sp.web.lists.getByTitle(listName).items
    .select(...fields);
    
  // Apply filter if configured
  if (config?.filterField && config?.filterValue) {
    query = query.filter(`${config.filterField} eq ${config.filterValue}`);
  }
  
  query = query
    .orderBy(sortField, sortDescending)
    .top(top);

  const items = await query();

  return items.map(i => config ? mapItemToCard(i, mapping) : mapPageToCard(i));
}



