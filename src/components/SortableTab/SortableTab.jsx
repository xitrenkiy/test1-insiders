import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { NavLink } from "react-router-dom";

const SortableTab = ({ tab, isActive, onRightClick, isDraggable }) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });

	const style = {
		transform: isDraggable ? CSS.Transform.toString(transform) : undefined,
		transition: isDraggable ? transition: undefined,
		cursor: isDraggable ? 'grab' : 'default'
	};

	return (
		<div
			ref={setNodeRef}
			to={tab.url}
			onContextMenu={(e) => onRightClick(e, tab.id)}
			style={style}
			>
				<NavLink to={tab.url} className={isActive ? 'tabs-item active': 'tabs-item'}>{tab.title}</NavLink>

				{isDraggable && (
					<span className="drag-handle" {...attributes} {...listeners}>
						☰
					</span>
				)}
		</div>
	)
}

export default SortableTab;