import { NewsCard } from '../BbcNews.types';

interface SharePointPageItem {
  Id: number;
  Title: string;
  FileRef: string;
  BannerImageUrl?: {
    Url: string;
  };
  Description?: string;
  FirstPublishedDate?: string;
}

export function mapPageToCard(i: SharePointPageItem): NewsCard {
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