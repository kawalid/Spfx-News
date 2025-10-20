/**
 * SharePoint data types used across the application
 */

/**
 * Represents a SharePoint Site Pages list item
 * Used when fetching news articles from SharePoint
 */
export interface SharePointPageItem {
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
