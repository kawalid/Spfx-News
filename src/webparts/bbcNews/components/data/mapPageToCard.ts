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

/**
 * Generates a document preview URL for SharePoint files
 */
function getDocumentPreviewUrl(fileUrl: string, siteUrl?: string): string | undefined {
  if (!fileUrl) return undefined;
  
  try {
    // For document libraries, try to get a thumbnail
    // SharePoint provides thumbnails via /_layouts/15/getpreview.ashx
    const site = siteUrl || window.location.origin;
    const encodedUrl = encodeURIComponent(fileUrl);
    
    // Check if it's a document file (not a page)
    const docExtensions = ['.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.pdf', '.txt'];
    const isDocument = docExtensions.some(ext => fileUrl.toLowerCase().endsWith(ext));
    
    if (isDocument) {
      // Use SharePoint's thumbnail service
      return `${site}/_layouts/15/getpreview.ashx?path=${encodedUrl}&resolution=2`;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error generating preview URL:', error);
    return undefined;
  }
}

export function mapPageToCard(i: any, fieldMappings?: FieldMappings): NewsCard {
  const titleField = fieldMappings?.titleField || 'Title';
  const descriptionField = fieldMappings?.descriptionField || 'Description';
  const imageField = fieldMappings?.imageField || 'BannerImageUrl';
  const dateField = fieldMappings?.dateField || 'FirstPublishedDate';
  const urlField = fieldMappings?.urlField || 'FileRef';
  
  // Handle image field - it might be a URL object, a plain string, or we need to generate a preview
  let imageUrl: string | undefined;
  if (i[imageField]) {
    if (typeof i[imageField] === 'object' && i[imageField].Url) {
      imageUrl = i[imageField].Url;
    } else if (typeof i[imageField] === 'string') {
      imageUrl = i[imageField];
    }
  }
  
  // If no image is provided but we have a FileRef, try to generate a document preview
  if (!imageUrl && i[urlField]) {
    imageUrl = getDocumentPreviewUrl(i[urlField]);
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