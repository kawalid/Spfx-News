import { ImageHelper, IImageHelperRequest } from '@microsoft/sp-image-helper';

export function getOptimizedImageUrl(src?: string, width?: number, height?: number): string | undefined {
  if (!src) return undefined;
  const req: IImageHelperRequest = {
      sourceUrl: src,
      width: 0
  };
  if (typeof width === 'number') req.width = width;
  if (typeof height === 'number') req.height = height;
  try { return ImageHelper.convertToImageUrl(req); } catch { return src; }
}
