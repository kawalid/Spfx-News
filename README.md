# BBC-Style SharePoint News Webpart  
**Built collaboratively with ChatGPT-5 + SPFx + PnPjs + Tailwind**

This project explores what happens when an experienced SharePoint developer partners with AI to build a complete, production-ready SPFx component.  
The goal: recreate a **BBC-style news layout** — accessible, dynamic, and editable — entirely through AI-assisted development.

**🎯 Now enhanced with configurable data sources!** Use this webpart with any SharePoint list or library, not just news pages.

---

## 🧠 Summary

By the final count, the build involved **~63 user prompts** and **~63 assistant replies** — about **130 messages in total**.  
Each iteration refined functionality, accessibility, and maintainability until we had a fully working, installable SPFx webpart.

---
![ChatGPTNews](https://github.com/user-attachments/assets/4232c637-a0a6-46e8-a82a-978a02c9ce96)

## 🔧 Main areas we covered

### 🧩 SPFx + PnPjs Wiring
- Correct `spfi().using(SPFx(...))` setup  
- Batched list queries via `sp.web.batched()`  
- **Configurable data sources with field mapping**
- **Custom filtering and sorting options**
- Fixed type errors, `ISPQueryable` mismatches, and `sp.web` injection  

### ⚙️ Build & Runtime Fixes
- Tailwind added via CDN with generated local CSS artifact  
- `domElement` undefined fixes and lifecycle guards  
- Proper module export alignment across components  

### 📰 Card Layout & Styling
- Fixed card heights and non-Tailwind line clamping (2-line title, 3-line summary)  
- Gentle hover animation, image helpers for thumbnails  
- BBC-style hero compositions with row fallbacks  

### 🎨 Visual Hero Polish
- Continuous gradient overlay across hero band  
- BBC-style tint/vignette fade mask  
- Padding, spacing, and alignment tuned to match BBC’s visual rhythm  
- Theme variable integration for dark/light consistency  

### ♿ Accessibility (WCAG 2.2 AA)
- Contrast and focus ring compliance  
- ≥24 px interactive targets  
- Full keyboard navigation  
- Screen reader live regions for updates  
- Reduced-motion mode  
- Accessible per-article slideshow support  

### 🧭 Curation UX (Edit Mode)
- Drag-and-drop ordering of selected articles  
- Add/remove with de-duplication logic  
- Batched title lookups for performance  
- Collapsible sections  
- Max-items cap (20) with visible counter + SR live region  

### 🧰 Toolbar & Settings
- In-webpart “Design Toolbar” (layout picker + open Property Pane)  
- `@pnp/spfx-controls-react` WebPartTitle with inline editing  
- Proper property-pane wiring and persistence  

### 🪶 Adaptive Cards Layout
- AdaptiveCardHost grid layout variant  
- Fixed height, 2-line title + description clamp  
- Dark overlay with white text for accessibility  
- Full-card click action + keyboard activation  

### 🎯 Generic & Reusable Features
- **Configurable Data Source**: Select any SharePoint list or library as the source
- **Field Mapping**: Map your own fields for title, image, description, and date
- **Custom Filtering**: Apply filters on any field (not just news pages)
- **Flexible Sorting**: Sort by any field in ascending or descending order
- Works with Site Pages, custom lists, document libraries, and more!  

---

## 🧩 What you get

A **ready-to-use SPFx Webpart** you can drop into your SharePoint tenant and configure for any list or library.

**In edit mode:**  
- **Select any SharePoint list or library** as the data source
- **Configure field mappings** for your specific content type
- **Set custom filters and sorting** options
- Select up to **20 items**, reorder them, and preview instantly  

**In view mode:**  
Renders a **BBC-style accessible layout** with your content:
- 5-item Hero strip  
- 2 rows of 5 compact cards  
- 5-item Hero strip  

Fully responsive, keyboard-navigable, and WCAG 2.2 AA-aligned.

---

## ⚙️ Configuration Options

### Data Source Settings
Configure the webpart to work with any SharePoint list:

- **List/Library name**: Choose any list (e.g., "Site Pages", "News", "Documents", "Custom List")
- **Filter field**: Optional field to filter by (e.g., "PromotedState", "Status", "Category")
- **Filter value**: Value to match (e.g., "2" for news, "Published" for status)
- **Sort field**: Field to sort by (e.g., "FirstPublishedDate", "Created", "Modified")
- **Sort order**: Ascending or descending

### Field Mapping
Map your list fields to the webpart display:

- **Title field**: Field containing the item title (default: "Title")
- **Image field**: Field containing the image URL (default: "BannerImageUrl")
- **Description field**: Field containing the description (default: "Description")
- **Date field**: Field containing the date (default: "FirstPublishedDate")

### Layout & Appearance
- **Web part title**: Customizable title
- **Layout**: Choose from 5 different layout styles
- **Theme color**: Customize the accent color
- **Max items**: Control how many items to display (4-20)

---

## 💡 Usage Examples

### Example 1: Standard SharePoint News
Perfect for displaying published news articles from Site Pages:
- **List name**: `Site Pages`
- **Filter field**: `PromotedState`
- **Filter value**: `2`
- **Sort field**: `FirstPublishedDate`
- **Sort descending**: ✓ (checked)

### Example 2: Custom Announcements List
Display items from a custom announcements list:
- **List name**: `Announcements`
- **Title field**: `Title`
- **Image field**: `AnnouncementImage`
- **Description field**: `Body`
- **Date field**: `Created`
- **Filter field**: `Status`
- **Filter value**: `Published`
- **Sort field**: `Created`

### Example 3: Document Library Highlights
Showcase featured documents:
- **List name**: `Documents`
- **Title field**: `Title`
- **Image field**: `ThumbnailUrl`
- **Description field**: `Comments`
- **Date field**: `Modified`
- **Filter field**: `Featured`
- **Filter value**: `Yes`
- **Sort field**: `Modified`

### Example 4: Events Calendar
Display upcoming or past events:
- **List name**: `Events`
- **Title field**: `Title`
- **Image field**: `EventImage`
- **Description field**: `Description`
- **Date field**: `EventDate`
- **Sort field**: `EventDate`
- **Sort descending**: (unchecked for upcoming events)

---

## 🚀 Installation

### Option 1 – Non-developers  
1. Download the latest `.sppkg` from [Releases](./releases).  
2. Upload to your SharePoint **App Catalog**.  
3. Add the **BBC News Webpart** to a modern page.  

Done ✅

### Option 2 – Developers  

```bash
git clone https://github.com/YOUR-USERNAME/bbc-sharepoint-news-webpart.git
cd bbc-sharepoint-news-webpart
npm install
gulp serve
