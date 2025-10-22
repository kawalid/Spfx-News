import * as React from 'react';
import { SPFI } from '@pnp/sp';
import CurateList from './CurateList';


interface Props {
sp: SPFI;
selected: string[];
onChange: (ids: string[]) => void;
maxItems: number;
listName?: string;
usePromotedStateFilter?: boolean;
}


const CuratePanel: React.FC<Props> = ({ sp, selected, onChange, maxItems, listName, usePromotedStateFilter }) => {
return (
<section className="mb-4 p-3 border border-neutral-300 rounded-2xl bg-white shadow-sm">
<header className="flex items-center justify-between gap-4">
<h2 className="text-lg font-semibold">Curate news</h2>
<div className="text-sm opacity-75">Drag to reorder • Click + to add</div>
</header>
<CurateList sp={sp} selected={selected} onChange={onChange} maxItems={maxItems} listName={listName} usePromotedStateFilter={usePromotedStateFilter} />
</section>
);
};


export default CuratePanel;