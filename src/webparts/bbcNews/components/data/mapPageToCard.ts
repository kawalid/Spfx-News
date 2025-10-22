/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsCard } from '../BbcNews.types';
import { FieldMappings } from './newsService';

/**
 * Strips HTML tags from a string
 */
function stripHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  
  // Create a temporary div element to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || undefined;
}

export function mapPageToCard(i: any, fieldMappings?: FieldMappings): NewsCard {
  const titleField = fieldMappings?.titleField || 'Title';
  const descriptionField = fieldMappings?.descriptionField || 'Description';
  const imageField = fieldMappings?.imageField || 'BannerImageUrl';
  const dateField = fieldMappings?.dateField || 'FirstPublishedDate';
  const urlField = fieldMappings?.urlField || 'FileRef';
  
  // Handle image field - it might be a URL object or a plain string
  let imageUrl: string | undefined;
  if (i[imageField]) {
    if (typeof i[imageField] === 'object' && i[imageField].Url) {
      imageUrl = i[imageField].Url;
    } else if (typeof i[imageField] === 'string') {
      imageUrl = i[imageField];
    }
  }
  
  return {
    id: String(i.Id),
    title: i[titleField],
    url: i[urlField],
    imageUrl,
    summary: stripHtml(i[descriptionField]),
    published: i[dateField],
  } as NewsCard;
}