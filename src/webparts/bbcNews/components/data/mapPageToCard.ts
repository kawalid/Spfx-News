/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsCard } from '../BbcNews.types';

export interface FieldMapping {
  titleField: string;
  imageField: string;
  descriptionField: string;
  dateField: string;
  urlField?: string; // Optional, defaults to FileRef
}

export function mapPageToCard(i: any): NewsCard {
const imageUrl = i?.BannerImageUrl?.Url || undefined;
return {
id: String(i.Id),
title: i.Title,
url: i.FileRef,
imageUrl,
summary: i.Description,
published: i.FirstPublishedDate,
} as NewsCard;
}

export function mapItemToCard(i: any, mapping: FieldMapping): NewsCard {
  // Handle image field - it might be a string or an object with Url property
  let imageUrl: string | undefined;
  const imageValue = i?.[mapping.imageField];
  if (imageValue) {
    imageUrl = typeof imageValue === 'string' ? imageValue : imageValue.Url;
  }
  
  return {
    id: String(i.Id),
    title: i[mapping.titleField] || '',
    url: mapping.urlField ? i[mapping.urlField] : i.FileRef,
    imageUrl,
    summary: i[mapping.descriptionField],
    published: i[mapping.dateField],
  } as NewsCard;
}