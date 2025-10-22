import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DisplayMode } from '@microsoft/sp-core-library';
import { SPFI } from '@pnp/sp';


export type LayoutVariant = 'lead-grid' | 'hero-list' | 'compact-cards' | 'hero-bbc'| 'hero-visual'| 'adaptive-cards' ;


export interface NewsCard {
id: string;
title: string;
url: string;
imageUrl?: string;
summary?: string;
published?: string; // ISO
siteTitle?: string;
}


export interface BbcNewsProps {
sp: SPFI;
context: WebPartContext;
displayMode: DisplayMode;
layout: LayoutVariant;
selected: string[];
maxItems: number;
themeColorHex?: string;
listName?: string;
usePromotedStateFilter?: boolean;
// Field mappings
titleField?: string;
descriptionField?: string;
imageField?: string;
dateField?: string;
urlField?: string;
onSelectionChange: (ids: string[]) => void;
 onLayoutChange?: (layout: LayoutVariant) => void;

  /** ⬇️ NEW: open SPFx property pane from the toolbar */
  openPropertyPane?: () => void;
 onTitleChange?: (title: string) => void;  
  title?: string;
}