import { NewsCard } from '../BbcNews.types';
import { SharePointPageItem } from './types';

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