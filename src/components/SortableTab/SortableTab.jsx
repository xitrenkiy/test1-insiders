import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NavLink } from 'react-router-dom';

const SortableTab = ({ tab, isActive, onRightClick, isDraggable }) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: isDraggable ? 'grab' : 'default',
		display: 'flex',
		alignItems: 'center',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			onContextMenu={(e) => onRightClick(e, tab.id)}
			className="sortable-tab"
		>
			<NavLink to={tab.url} className={isActive ? 'tabs-item active' : 'tabs-item'}>
				{tab.title}
			</NavLink>

			{isDraggable && (
				<span className="drag-handle" {...attributes} {...listeners}>
					☰
				</span>
			)}
		</div>
	);
};

export default SortableTab;
