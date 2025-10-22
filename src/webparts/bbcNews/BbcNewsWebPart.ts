/* eslint-disable @microsoft/spfx/pair-react-dom-render-unmount */
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { spfi, SPFx, SPFI } from '@pnp/sp';
import { SPComponentLoader } from '@microsoft/sp-loader';

import BbcNews from './components/BbcNews';
import { BbcNewsProps, LayoutVariant } from './components/BbcNews.types';

export interface IBbcNewsWebPartProps {
  layout: LayoutVariant;
  selected: string[];
  maxItems: number;
  themeColorHex?: string;
  title?: string;
  
  // Configurable data source
  listName?: string;
  titleField?: string;
  imageField?: string;
  descriptionField?: string;
  dateField?: string;
  filterField?: string;
  filterValue?: string;
  sortField?: string;
  sortDescending?: boolean;
}

export default class BbcNewsWebPart extends BaseClientSideWebPart<IBbcNewsWebPartProps> {
  private _sp!: SPFI;
  private _cssLoaded = false;

  public async onInit(): Promise<void> {
    this._sp = spfi().using(SPFx(this.context));

    // Defaults
    if (!this.properties.layout) this.properties.layout = 'hero-visual';
    if (!this.properties.maxItems) this.properties.maxItems = 20;
    if (!this.properties.selected) this.properties.selected = [];
    if (!this.properties.themeColorHex) this.properties.themeColorHex = '#6d28d9';
    if (!this.properties.title) this.properties.title = 'News';
    
    // Data source defaults
    if (!this.properties.listName) this.properties.listName = 'Site Pages';
    if (!this.properties.titleField) this.properties.titleField = 'Title';
    if (!this.properties.imageField) this.properties.imageField = 'BannerImageUrl';
    if (!this.properties.descriptionField) this.properties.descriptionField = 'Description';
    if (!this.properties.dateField) this.properties.dateField = 'FirstPublishedDate';
    if (!this.properties.filterField) this.properties.filterField = 'PromotedState';
    if (!this.properties.filterValue) this.properties.filterValue = '2';
    if (!this.properties.sortField) this.properties.sortField = 'FirstPublishedDate';
    if (this.properties.sortDescending === undefined) this.properties.sortDescending = true;

    // Tailwind via CDN (once)
    if (!this._cssLoaded) {
      SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css');
      this._cssLoaded = true;
    }
  }

  public render(): void {
    const element: React.ReactElement<BbcNewsProps> = React.createElement(BbcNews, {
      sp: this._sp,
      context: this.context,
      displayMode: this.displayMode,

      layout: this.properties.layout,
      selected: this.properties.selected,
      maxItems: this.properties.maxItems,
      themeColorHex: this.properties.themeColorHex,
      
      // Data source configuration
      listName: this.properties.listName,
      titleField: this.properties.titleField,
      imageField: this.properties.imageField,
      descriptionField: this.properties.descriptionField,
      dateField: this.properties.dateField,
      filterField: this.properties.filterField,
      filterValue: this.properties.filterValue,
      sortField: this.properties.sortField,
      sortDescending: this.properties.sortDescending,

      // Title wiring (PnP WebPartTitle)
      title: this.properties.title,
      onTitleChange: (t: string) => {
        this.properties.title = t;
        this.render();
      },

      // Selection updates
      onSelectionChange: (ids: string[]) => {
        this.properties.selected = ids;
        this.render();
      },

      // Layout picker in top actions
      onLayoutChange: (layout) => {
        this.properties.layout = layout;
        this.render();
      },

      // Open property pane from top actions
      openPropertyPane: () => {
        this.context.propertyPane.open();
      },
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    if (this.domElement) ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'News settings' },
          groups: [
            {
              groupName: 'Layout & Appearance',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Web part title',
                }),
                PropertyPaneChoiceGroup('layout', {
                  label: 'Layout',
                  options: [
                    { key: 'hero-visual',   text: 'Hero (Visual banner)' },
                    { key: 'hero-bbc',      text: 'Hero (BBC style)' },
                    { key: 'lead-grid',     text: 'Lead + Grid' },
                    { key: 'hero-list',     text: 'Accessible Slideshow' },
                    { key: 'compact-cards', text: 'Compact cards' },
                    
                  ],
                }),
                PropertyPaneTextField('themeColorHex', {
                  label: 'Theme color (hex, e.g. #6d28d9)',
                  description: 'Tints the visual hero background and accents.',
                }),
                PropertyPaneSlider('maxItems', {
                  label: 'Max items shown',
                  min: 4,
                  max: 20,
                  step: 1,
                  showValue: true,
                }),
              ],
            },
            {
              groupName: 'Data Source',
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'List/Library name',
                  description: 'Name of the SharePoint list or library to fetch items from (e.g., "Site Pages", "News", "Documents")',
                }),
                PropertyPaneTextField('filterField', {
                  label: 'Filter field',
                  description: 'Field to filter by (leave empty for no filter)',
                }),
                PropertyPaneTextField('filterValue', {
                  label: 'Filter value',
                  description: 'Value to filter by (e.g., "2" for PromotedState)',
                }),
                PropertyPaneTextField('sortField', {
                  label: 'Sort field',
                  description: 'Field to sort by (e.g., "FirstPublishedDate", "Created", "Modified")',
                }),
                PropertyPaneToggle('sortDescending', {
                  label: 'Sort descending',
                  onText: 'Descending (newest first)',
                  offText: 'Ascending (oldest first)',
                }),
              ],
            },
            {
              groupName: 'Field Mapping',
              groupFields: [
                PropertyPaneTextField('titleField', {
                  label: 'Title field',
                  description: 'Field to use for item title (default: "Title")',
                }),
                PropertyPaneTextField('imageField', {
                  label: 'Image field',
                  description: 'Field to use for item image (default: "BannerImageUrl")',
                }),
                PropertyPaneTextField('descriptionField', {
                  label: 'Description field',
                  description: 'Field to use for item description (default: "Description")',
                }),
                PropertyPaneTextField('dateField', {
                  label: 'Date field',
                  description: 'Field to use for item date (default: "FirstPublishedDate")',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
