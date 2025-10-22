/* eslint-disable @microsoft/spfx/pair-react-dom-render-unmount */
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { spfi, SPFx, SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import { SPComponentLoader } from '@microsoft/sp-loader';

import BbcNews from './components/BbcNews';
import { BbcNewsProps, LayoutVariant } from './components/BbcNews.types';

export interface IBbcNewsWebPartProps {
  layout: LayoutVariant;
  selected: string[];
  maxItems: number;
  themeColorHex?: string;
  title?: string;
  listName?: string;
  usePromotedStateFilter?: boolean;
}

export default class BbcNewsWebPart extends BaseClientSideWebPart<IBbcNewsWebPartProps> {
  private _sp!: SPFI;
  private _cssLoaded = false;
  private _listsDropdownOptions: IPropertyPaneDropdownOption[] = [];
  private _listsLoaded = false;

  public async onInit(): Promise<void> {
    this._sp = spfi().using(SPFx(this.context));

    // Defaults
    if (!this.properties.layout) this.properties.layout = 'hero-visual';
    if (!this.properties.maxItems) this.properties.maxItems = 20;
    if (!this.properties.selected) this.properties.selected = [];
    if (!this.properties.themeColorHex) this.properties.themeColorHex = '#6d28d9';
    if (!this.properties.title) this.properties.title = 'News';
    if (!this.properties.listName) this.properties.listName = 'Site Pages';
    if (this.properties.usePromotedStateFilter === undefined) this.properties.usePromotedStateFilter = true;

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
      listName: this.properties.listName,
      usePromotedStateFilter: this.properties.usePromotedStateFilter,

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

  private async loadLists(): Promise<void> {
    if (this._listsLoaded) return;

    try {
      const lists = await this._sp.web.lists
        .filter('Hidden eq false and BaseTemplate eq 100')
        .select('Title')
        .top(100)();

      this._listsDropdownOptions = lists.map(list => ({
        key: list.Title,
        text: list.Title
      }));

      this._listsLoaded = true;
    } catch (error) {
      console.error('Error loading lists:', error);
      this._listsDropdownOptions = [
        { key: 'Site Pages', text: 'Site Pages' },
        { key: 'Events', text: 'Events' }
      ];
    }
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    await this.loadLists();
    this.context.propertyPane.refresh();
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    
    // Refresh the page when list name or filter changes
    if (propertyPath === 'listName' || propertyPath === 'usePromotedStateFilter') {
      this.render();
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'News settings' },
          groups: [
            {
              groupName: 'Data Source',
              groupFields: [
                PropertyPaneDropdown('listName', {
                  label: 'List name',
                  options: this._listsDropdownOptions,
                  selectedKey: this.properties.listName || 'Site Pages',
                }),
                PropertyPaneToggle('usePromotedStateFilter', {
                  label: 'Filter by PromotedState',
                  onText: 'Yes - Only show news items (PromotedState = 2)',
                  offText: 'No - Show all items from the list',
                }),
              ],
            },
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
          ],
        },
      ],
    };
  }
}
