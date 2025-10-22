/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from 'react';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import AdaptiveGrid from './layouts/AdaptiveGrid';
import { BbcNewsProps, NewsCard } from './BbcNews.types';
import { useIsEditMode } from './hooks/useIsEditMode';
import { getNewsByIds, getLatestNews } from './data/newsService';

import DesignToolbar from './edit/DesignToolbar';
import CuratePanel from './edit/CuratePanel';

import LeadGrid from './layouts/LeadGrid';
import HeroList from './layouts/HeroList';
import CompactCards from './layouts/CompactCards';
import HeroBbc from './layouts/HeroBbc';
import HeroVisual from './layouts/HeroVisual';

const BbcNews: React.FC<BbcNewsProps> = (props) => {
  const isEdit = useIsEditMode(props.displayMode);

  const [items, setItems] = React.useState<NewsCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Collapse the curation UI to preview layout changes quickly
  const [showCurator, setShowCurator] = React.useState<boolean>(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const data = props.selected?.length
          ? await getNewsByIds(props.sp, props.selected, props.listName, props.usePromotedStateFilter)
          : await getLatestNews(props.sp, props.maxItems, props.listName, props.usePromotedStateFilter);

        if (!active) return;
        setItems(data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load news');
      } finally {
        setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [props.sp, props.selected, props.maxItems, props.listName, props.usePromotedStateFilter]);

  // Choose standard layouts; hero-visual needs themeColorHex
  const StdLayout =
    props.layout === 'lead-grid' ? LeadGrid
    : props.layout === 'hero-list' ? HeroList
    : props.layout === 'hero-bbc' ? HeroBbc
     : props.layout === 'adaptive-cards' ? AdaptiveGrid
    : CompactCards;

  // Enforce max items for the view
  const visible = React.useMemo(
    () => (items ?? []).slice(0, props.maxItems),
    [items, props.maxItems]
  );

  return (
    <section
      role="region"
      aria-label={props.title ?? 'News'}    
      className="font-sans"
      style={{ display: 'grid', gap: 8 }}
    >
      {/* Web part title (inline editable in edit mode) */}
      <WebPartTitle
        displayMode={props.displayMode}
        title={props.title ?? 'News'}
        updateProperty={(val) => props.onTitleChange?.(val)}
        className="mb-2"
      />

      {isEdit && (
        <>
          {/* Top actions: layout picker + open property pane */}
          <DesignToolbar
            layout={props.layout}
            onChange={(l) => props.onLayoutChange?.(l)}
            openSettings={props.openPropertyPane}
          />

          {/* Collapse/expand the whole curator to preview layout changes */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => setShowCurator(v => !v)}
              aria-expanded={showCurator}
              aria-controls="bbc-curator"
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {showCurator ? '▾ Hide curation' : '▸ Show curation'}
            </button>
          </div>

          {showCurator && (
            <div id="bbc-curator">
              <CuratePanel
                sp={props.sp}
                selected={props.selected}
                onChange={props.onSelectionChange}
                maxItems={props.maxItems}
                listName={props.listName}
                usePromotedStateFilter={props.usePromotedStateFilter}
              />
            </div>
          )}
        </>
      )}

      {/* Status */}
      {loading && <div className="p-6" aria-live="polite">Loading…</div>}
      {error && <div className="p-6 text-red-700" role="alert">{error}</div>}

      {/* Render */}
      {!loading && !error && (
        props.layout === 'hero-visual'
          ? <HeroVisual items={visible} themeColorHex={props.themeColorHex} />
          : <StdLayout items={visible} />
      )}
    </section>
  );
};

export default BbcNews;
