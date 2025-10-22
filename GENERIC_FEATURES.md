# Generic & Reusable Features

This document describes the enhancements made to make the BBC-style News Webpart fully generic and reusable across any SharePoint site.

## Overview

The webpart has been enhanced to work with **any SharePoint list or library**, not just Site Pages news. You can now configure:
- Data source (list/library)
- Field mappings
- Custom filters
- Sorting options

## What Changed

### 1. Configurable Data Source

**Before:** Hardcoded to fetch from "Site Pages" list with `PromotedState eq 2` filter.

**After:** Fully configurable through Property Pane:
- List/Library name
- Filter field and value
- Sort field and direction

### 2. Field Mapping

**Before:** Used hardcoded field names (Title, BannerImageUrl, Description, FirstPublishedDate).

**After:** Configurable field mapping:
- Title field
- Image field
- Description field
- Date field

### 3. Updated Components

#### BbcNewsWebPart.ts
- Added new interface properties for data source configuration
- Added PropertyPaneTextField controls for list name and field mappings
- Added PropertyPaneToggle for sort direction
- Passes configuration to child components

#### newsService.ts
- Added `DataSourceConfig` interface
- Updated `getNewsByIds()` and `getLatestNews()` to accept configuration
- Dynamic field selection based on configuration
- Configurable filtering and sorting

#### mapPageToCard.ts
- Added `FieldMapping` interface
- New `mapItemToCard()` function that accepts field mapping
- Handles different field types (string vs object for images)

#### BbcNews.tsx
- Builds configuration object from props
- Passes configuration to newsService calls
- Passes configuration to CuratePanel

#### CuratePanel.tsx & CurateList.tsx
- Accepts and uses configuration
- Fetches items from configured list
- Uses configured field names
- Applies configured filters and sorting

## Configuration Properties

### Data Source Settings
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| listName | string | "Site Pages" | Name of the SharePoint list or library |
| filterField | string | "PromotedState" | Field to filter by (optional) |
| filterValue | string | "2" | Value to match in filter |
| sortField | string | "FirstPublishedDate" | Field to sort by |
| sortDescending | boolean | true | Sort direction |

### Field Mapping
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| titleField | string | "Title" | Field containing item title |
| imageField | string | "BannerImageUrl" | Field containing image URL |
| descriptionField | string | "Description" | Field containing description |
| dateField | string | "FirstPublishedDate" | Field containing date |

## Usage Examples

### Example 1: News Articles (Default)
```typescript
listName: "Site Pages"
filterField: "PromotedState"
filterValue: "2"
sortField: "FirstPublishedDate"
sortDescending: true
titleField: "Title"
imageField: "BannerImageUrl"
descriptionField: "Description"
dateField: "FirstPublishedDate"
```

### Example 2: Custom Announcements
```typescript
listName: "Announcements"
filterField: "Status"
filterValue: "Published"
sortField: "Created"
sortDescending: true
titleField: "Title"
imageField: "AnnouncementImage"
descriptionField: "Body"
dateField: "Created"
```

### Example 3: Document Library
```typescript
listName: "Documents"
filterField: "Featured"
filterValue: "Yes"
sortField: "Modified"
sortDescending: true
titleField: "Title"
imageField: "ThumbnailUrl"
descriptionField: "Comments"
dateField: "Modified"
```

### Example 4: Events (Upcoming)
```typescript
listName: "Events"
filterField: "" // No filter
filterValue: ""
sortField: "EventDate"
sortDescending: false // Ascending for upcoming
titleField: "Title"
imageField: "EventImage"
descriptionField: "Description"
dateField: "EventDate"
```

## Backward Compatibility

All new properties have default values that maintain the original behavior:
- Existing webpart instances will continue to work without any changes
- Default values match the original hardcoded behavior
- No breaking changes to existing deployments

## Benefits

1. **Increased Reusability**: Use the same webpart for multiple content types
2. **Flexibility**: Works with any list schema
3. **No Code Changes**: Configure through Property Pane
4. **Maintainability**: Single webpart for multiple use cases
5. **Consistency**: Same UI/UX across different content types

## Technical Implementation

The implementation follows these principles:
- **Minimal Changes**: Surgical updates to existing code
- **Type Safety**: Proper TypeScript interfaces
- **Performance**: Uses PnPjs batching for efficient queries
- **Error Handling**: Graceful fallbacks for missing fields
- **Accessibility**: Maintains WCAG 2.2 AA compliance

## Future Enhancements

Potential future improvements:
- List picker control in Property Pane
- Field picker controls
- Visual query builder
- Multiple filter support
- Advanced sorting (multiple fields)
- Template system for common configurations
