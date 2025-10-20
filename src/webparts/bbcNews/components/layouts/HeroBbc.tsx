// HeroBbc.tsx
import * as React from 'react';
import Card from '../ui/Card';
import { NewsCard } from '../BbcNews.types';

const HERO_H = 612;      // total height of the whole top strip
const COL_GAP = 16;      // horizontal gap (kept for layout only)
const STACK_GAP = 12;    // vertical gap inside stacked columns

// Derived heights
const MID_CARD_H   = Math.floor((HERO_H - STACK_GAP) / 2);        // 2 stacked → (612-12)/2 = 300
const RAIL_ITEM_H  = Math.floor((HERO_H - (3 * STACK_GAP)) / 4);  // 4 stacked → (612-36)/4 = 144

const HeroBbc: React.FC<{ items: NewsCard[] }> = ({ items }) => {
  if (!items?.length) return null;

  const [hero, ...rest] = items;

  // Middle 4 (image cards: 2 + 2)
  const img4     = rest.slice(0, 4);
  const midLeft  = img4.slice(0, Math.min(2, img4.length));
  const midRight = img4.slice(midLeft.length, 4);

  // Right rail 4 (text-only)
  const text4 = rest.slice(4, 8);

  // Remaining go below
  const remainder = rest.slice(8);

  // Top strip: hero + two image columns + right rail
  const topGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,2.3fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
    gap: COL_GAP,
    alignItems: 'stretch',
  };
  const stackCol: React.CSSProperties = { display: 'grid', gap: STACK_GAP, height: HERO_H };

  // Build rows for the remainder: 5, then 4, then 3
  const rows: NewsCard[][] = [];
  const tail = remainder.slice();
  while (tail.length) {
    if (tail.length >= 5) { rows.push(tail.splice(0, 5)); }
    else if (tail.length >= 4) { rows.push(tail.splice(0, 4)); }
    else { rows.push(tail.splice(0, Math.min(3, tail.length))); }
  }
  const rowStyle = (cols: number): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: 16,
  });

  return (
    <section aria-label="Top stories" style={{ display: 'grid', gap: 32 }}>
      {/* Top strip – exactly 612px tall across all columns */}
      <div style={topGrid}>
        {/* Left: big hero fixed to 612px */}
        <div style={{ height: HERO_H }}>
          <Card item={hero} variant="hero" fixedHeight={HERO_H} />
        </div>

        {/* Middle-left: 2 stacked image cards @ 300px */}
        <div style={stackCol}>
          {midLeft.map(i => (
            <Card key={i.id} item={i} variant="grid" fixedHeight={MID_CARD_H} />
          ))}
        </div>

        {/* Middle-right: 2 stacked image cards @ 300px */}
        <div style={stackCol}>
          {midRight.map(i => (
            <Card key={i.id} item={i} variant="grid" fixedHeight={MID_CARD_H} />
          ))}
        </div>

        {/* Right rail: 4 stacked text-only list cards @ 144px */}
        <div role="list" aria-label="More headlines" style={stackCol}>
          {text4.map(i => (
            <div role="listitem" key={i.id} style={{ height: RAIL_ITEM_H }}>
              <Card item={i} variant="list" hideImage fixedHeight={RAIL_ITEM_H} />
            </div>
          ))}
        </div>
      </div>

      {/* Remaining rows: 5, then 4, then 3 */}
      {rows.length > 0 && (
        <div style={{ display: 'grid', gap: 32 }}>
          {rows.map((row, idx) => (
            <div key={idx} style={rowStyle(Math.max(3, Math.min(5, row.length)))}>
              {row.map(i => <Card key={i.id} item={i} variant="teaser" />)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBbc;
