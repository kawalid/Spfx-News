/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from 'react';
import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  sp: SPFI;
  selected: string[];
  onChange: (ids: string[]) => void;
  maxItems: number;
  listName?: string;
  usePromotedStateFilter?: boolean;
}

type PickerItem = { id: string; title: string };

const Row: React.FC<{ id: string; title: string; onRemove: () => void; }> = ({
  id, title, onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 rounded-xl border p-2 mb-2 bg-neutral-50"
    >
      <button aria-label="Drag" {...attributes} {...listeners} className="cursor-grab px-2">⋮⋮</button>
      <div className="flex-1 truncate">{title}</div>
      <button
        onClick={onRemove}
        className="text-sm px-2 py-1 rounded-lg border hover:bg-neutral-100"
        aria-label={`Remove ${title}`}
      >
        Remove
      </button>
    </li>
  );
};

const SectionHeader: React.FC<{
  title: string;
  count?: number;
  expanded: boolean;
  onToggle: () => void;
  controlsId: string;
}> = ({ title, count, expanded, onToggle, controlsId }) => (
  <div className="flex items-center gap-2 mb-2">
    <button
      type="button"
      className="text-sm px-2 py-1 rounded-lg border hover:bg-neutral-100"
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      {expanded ? '▾' : '▸'} {title}{typeof count === 'number' ? ` (${count})` : ''}
    </button>
  </div>
);

const CurateList: React.FC<Props> = ({ sp, selected, onChange, maxItems, listName = 'Site Pages', usePromotedStateFilter = true }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const [titles, setTitles] = React.useState<Record<string, string>>({});
  const [picker, setPicker] = React.useState<PickerItem[]>([]);
  const recentAllRef = React.useRef<PickerItem[]>([]);

  // NEW: collapsible state
  const [showSelected, setShowSelected] = React.useState(true);
  const [showAdd, setShowAdd] = React.useState(false); // start collapsed to show more of the layout

  // load recent (with optional PromotedState filter)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      // Build select fields based on filter configuration
      const selectFields = usePromotedStateFilter
        ? 'Id,Title,FirstPublishedDate,PromotedState'
        : 'Id,Title,FirstPublishedDate';

      let query = sp.web.lists
        .getByTitle(listName)
        .items.select(selectFields);

      // Apply PromotedState filter only if enabled
      if (usePromotedStateFilter) {
        query = query.filter('PromotedState eq 2');
      }

      const items = await query
        .orderBy('FirstPublishedDate', false)
        .top(50)();

      const recent: PickerItem[] = items.map((i: any) => ({ id: String(i.Id), title: i.Title }));
      if (!mounted) return;

      recentAllRef.current = recent;

      setTitles(prev => {
        const next = { ...prev };
        for (const r of recent) next[r.id] = r.title;
        return next;
      });

      setPicker(recent.filter(r => !selected.includes(r.id)));
    })();
    return () => { mounted = false; };
  }, [sp, listName, usePromotedStateFilter]);

  // when selected changes, batch-load missing titles and refilter picker
  React.useEffect(() => {
    let mounted = true;
    setPicker(recentAllRef.current.filter(r => !selected.includes(r.id)));

    const missing = selected.filter(id => !titles[id]);
    if (missing.length === 0) return;

    (async () => {
      const [web, exec] = sp.web.batched();
      const buf: any[] = new Array(missing.length);

      missing.forEach((id, idx) => {
        web.lists.getByTitle(listName).items.getById(Number(id))
          .select('Id,Title')()
          .then(i => { buf[idx] = i; })
          .catch(() => { buf[idx] = null; });
      });

      await exec();
      if (!mounted) return;

      setTitles(prev => {
        const next = { ...prev };
        buf.filter(Boolean).forEach((i: any) => { next[String(i.Id)] = i.Title; });
        return next;
      });
    })();

    return () => { mounted = false; };
  }, [sp, selected.join(',')]);

  // DnD
  function onDragEnd(e: any) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = selected.indexOf(active.id);
    const newIndex = selected.indexOf(over.id);
    onChange(arrayMove(selected, oldIndex, newIndex));
  }

  // Add / Remove
  function add(id: string) {
    if (selected.includes(id)) return;
    if (selected.length >= maxItems) return;
    onChange([...selected, id]);
    setPicker(prev => prev.filter(p => p.id !== id));
  }

  function remove(id: string) {
    onChange(selected.filter(x => x !== id));
    setPicker(prev => {
      const already = prev.some(p => p.id === id);
      if (already) return prev;
      const title = titles[id] ?? id;
      const recent = recentAllRef.current;
      const recentIdx = recent.findIndex(r => r.id === id);
      if (recentIdx >= 0) {
        const next = [...prev, { id, title }];
        next.sort((a, b) => {
          const ia = recent.findIndex(r => r.id === a.id);
          const ib = recent.findIndex(r => r.id === b.id);
          return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
        });
        return next;
      }
      return [{ id, title }, ...prev];
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
      {/* Selected (sortable, collapsible) */}
      <div>
        <SectionHeader
          title="Selected"
          count={selected.length}
          expanded={showSelected}
          onToggle={() => setShowSelected(v => !v)}
          controlsId="curate-selected"
        />
        {showSelected && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={selected} strategy={verticalListSortingStrategy}>
              <ul id="curate-selected" role="list">
                {selected.map(id => (
                  <Row
                    key={id}
                    id={id}
                    title={titles[id] ?? id}
                    onRemove={() => remove(id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add from recent (collapsible) */}
      <div>
        <SectionHeader
          title="Add from recent"
          count={picker.length}
          expanded={showAdd}
          onToggle={() => setShowAdd(v => !v)}
          controlsId="curate-add"
        />
        {showAdd && (
          <ul id="curate-add" role="list">
            {picker.map(p => (
              <li key={p.id} className="flex items-center justify-between gap-2 py-1">
                <span className="truncate" title={p.title}>{p.title}</span>
                <button
                  onClick={() => add(p.id)}
                  className="text-sm px-2 py-1 rounded-lg border hover:bg-neutral-100"
                  aria-label={`Add ${p.title}`}
                >
                  Add
                </button>
              </li>
            ))}
            {picker.length === 0 && (
              <li className="text-sm opacity-70">No more recent news to add.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CurateList;
