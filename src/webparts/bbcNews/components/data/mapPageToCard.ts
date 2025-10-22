/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsCard } from '../BbcNews.types';

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

export function mapPageToCard(i: any): NewsCard {
const imageUrl = i?.BannerImageUrl?.Url || undefined;
return {
id: String(i.Id),
title: i.Title,
url: i.FileRef,
imageUrl,
summary: stripHtml(i.Description),
published: i.FirstPublishedDate,
} as NewsCard;
}