# Configuration Guide

This guide explains how to configure the BBC-style News Webpart for different use cases.

## Property Pane Overview

The webpart Property Pane is organized into three sections:

### 1. Layout & Appearance
Configure the visual presentation of the webpart.

### 2. Data Source
Configure where the webpart gets its data from.

### 3. Field Mapping
Configure which fields to use from your list.

---

## Property Pane Sections

### Section 1: Layout & Appearance

| Setting | Type | Description |
|---------|------|-------------|
| **Web part title** | Text | Title displayed above the webpart |
| **Layout** | Choice | Choose from 5 layout styles:<br>• Hero (Visual banner)<br>• Hero (BBC style)<br>• Lead + Grid<br>• Accessible Slideshow<br>• Compact cards |
| **Theme color** | Text | Hex color code (e.g., #6d28d9) for accents |
| **Max items shown** | Slider | Number of items to display (4-20) |

### Section 2: Data Source

| Setting | Type | Description | Example |
|---------|------|-------------|---------|
| **List/Library name** | Text | Name of the SharePoint list or library | `Site Pages`, `Announcements`, `Documents` |
| **Filter field** | Text | Field to filter by (optional) | `PromotedState`, `Status`, `Category` |
| **Filter value** | Text | Value to match in filter | `2`, `Published`, `Featured` |
| **Sort field** | Text | Field to sort results by | `FirstPublishedDate`, `Created`, `Modified` |
| **Sort descending** | Toggle | Sort order | ✓ for newest first, ✗ for oldest first |

### Section 3: Field Mapping

| Setting | Type | Description | Example |
|---------|------|-------------|---------|
| **Title field** | Text | Field containing item title | `Title`, `Name`, `Subject` |
| **Image field** | Text | Field containing image URL | `BannerImageUrl`, `ThumbnailUrl`, `ImageUrl` |
| **Description field** | Text | Field containing description | `Description`, `Body`, `Summary` |
| **Date field** | Text | Field containing date | `FirstPublishedDate`, `Created`, `EventDate` |

---

## Step-by-Step Configuration

### Scenario 1: SharePoint News (Default)

**Goal**: Display published news articles from Site Pages

1. **Layout & Appearance**
   - Web part title: `News`
   - Layout: `Hero (Visual banner)`
   - Theme color: `#6d28d9`
   - Max items: `15`

2. **Data Source**
   - List/Library name: `Site Pages`
   - Filter field: `PromotedState`
   - Filter value: `2`
   - Sort field: `FirstPublishedDate`
   - Sort descending: ✓ (checked)

3. **Field Mapping**
   - Title field: `Title`
   - Image field: `BannerImageUrl`
   - Description field: `Description`
   - Date field: `FirstPublishedDate`

### Scenario 2: Custom Announcements

**Goal**: Display published announcements from a custom list

1. **Layout & Appearance**
   - Web part title: `Latest Announcements`
   - Layout: `Compact cards`
   - Theme color: `#059669`
   - Max items: `10`

2. **Data Source**
   - List/Library name: `Announcements`
   - Filter field: `Status`
   - Filter value: `Published`
   - Sort field: `Created`
   - Sort descending: ✓ (checked)

3. **Field Mapping**
   - Title field: `Title`
   - Image field: `AnnouncementImage`
   - Description field: `Body`
   - Date field: `Created`

### Scenario 3: Document Highlights

**Goal**: Display featured documents from a library

1. **Layout & Appearance**
   - Web part title: `Featured Documents`
   - Layout: `Lead + Grid`
   - Theme color: `#dc2626`
   - Max items: `12`

2. **Data Source**
   - List/Library name: `Documents`
   - Filter field: `Featured`
   - Filter value: `Yes`
   - Sort field: `Modified`
   - Sort descending: ✓ (checked)

3. **Field Mapping**
   - Title field: `Title`
   - Image field: `ThumbnailUrl`
   - Description field: `Comments`
   - Date field: `Modified`

### Scenario 4: Upcoming Events

**Goal**: Display upcoming events sorted chronologically

1. **Layout & Appearance**
   - Web part title: `Upcoming Events`
   - Layout: `Hero (BBC style)`
   - Theme color: `#7c3aed`
   - Max items: `8`

2. **Data Source**
   - List/Library name: `Events`
   - Filter field: *(leave empty)*
   - Filter value: *(leave empty)*
   - Sort field: `EventDate`
   - Sort descending: ✗ (unchecked - ascending order)

3. **Field Mapping**
   - Title field: `Title`
   - Image field: `EventImage`
   - Description field: `Description`
   - Date field: `EventDate`

### Scenario 5: Team Blog Posts

**Goal**: Display blog posts from a custom list

1. **Layout & Appearance**
   - Web part title: `Team Blog`
   - Layout: `Accessible Slideshow`
   - Theme color: `#2563eb`
   - Max items: `15`

2. **Data Source**
   - List/Library name: `Blog Posts`
   - Filter field: `PublishStatus`
   - Filter value: `Published`
   - Sort field: `PublishDate`
   - Sort descending: ✓ (checked)

3. **Field Mapping**
   - Title field: `Title`
   - Image field: `FeaturedImage`
   - Description field: `Excerpt`
   - Date field: `PublishDate`

---

## Tips & Best Practices

### Choosing the Right Layout

- **Hero (Visual banner)**: Best for rich, visual content with high-quality images
- **Hero (BBC style)**: Classic news layout, good for text-heavy content
- **Lead + Grid**: Highlights one main item, good for featured content
- **Accessible Slideshow**: Great for accessibility, sequential reading
- **Compact cards**: Space-efficient, shows more items at once

### Performance Considerations

- **Max items**: Lower values (4-8) load faster
- **Images**: Ensure image fields contain URLs, not file paths
- **Filters**: Use indexed fields for better performance
- **Sorting**: Sort by indexed date fields when possible

### Troubleshooting

**Problem**: No items appear
- **Solution**: Check that the list name is spelled correctly
- **Solution**: Verify filter field and value match your list data
- **Solution**: Check that items exist matching your filter

**Problem**: Images don't show
- **Solution**: Verify the image field contains URLs
- **Solution**: Try a different image field name
- **Solution**: Check image field type (some fields store objects with Url property)

**Problem**: Wrong data appears
- **Solution**: Verify field names match your list schema exactly (case-sensitive)
- **Solution**: Check Data Source settings are correct
- **Solution**: Clear browser cache and refresh

### Field Name Discovery

To find the correct field names for your list:

1. Go to List Settings in SharePoint
2. Click on any field name
3. Look at the URL parameter `Field=FieldInternalName`
4. Use the internal name in the webpart configuration

**Example**: 
- Display name: "Event Image"
- Internal name: `EventImage`
- Use in webpart: `EventImage`

---

## Advanced Filtering

### Single Value Filters
Most common case - match one value:
- Filter field: `Status`
- Filter value: `Published`

### Numeric Filters
For number fields:
- Filter field: `PromotedState`
- Filter value: `2`

### No Filter
To show all items:
- Filter field: *(leave empty)*
- Filter value: *(leave empty)*

**Note**: Currently supports single field filtering. For multiple conditions, consider creating a calculated field in SharePoint.

---

## Common SharePoint Fields

### Site Pages (News)
- Title: `Title`
- Image: `BannerImageUrl`
- Description: `Description`
- Date: `FirstPublishedDate`
- Filter: `PromotedState` = `2`

### Document Libraries
- Title: `Title`
- Image: `ThumbnailUrl` or `PreviewImageUrl`
- Description: `Comments`
- Date: `Modified` or `Created`

### Custom Lists
- Title: Usually `Title`
- Date: `Created`, `Modified`, or custom date field
- Other fields: Varies by list

### Calendar/Events
- Title: `Title`
- Description: `Description`
- Date: `EventDate`, `StartDate`, or `EndDate`
- Location: `Location`

---

## Migration from Hardcoded Version

If you're upgrading from a previous version:

1. **Existing instances** will continue to work with defaults
2. **No action required** unless you want to customize
3. **To customize**: Open Property Pane and configure as needed
4. **Default values** match the original hardcoded behavior

---

## Support & Resources

- **README.md**: General overview and installation
- **GENERIC_FEATURES.md**: Technical implementation details
- **This Guide**: Configuration and usage examples

For issues or questions, check the repository Issues section.
