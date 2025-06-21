import { useState, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useLocation } from 'react-router-dom';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import SortableTab from '../SortableTab/SortableTab';

import './TabsContainer.css';

function TabsContainer() {
	const [tabs, setTabs] = useLocalStorage();
	const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
	const [openedId, setOpenedId] = useState(null);
	const [isOpenedPin, setIsOpenedPin] = useState(false);
	const sensors = useSensors(useSensor(PointerSensor));
	const location = useLocation();

	const sortedTabs = [...tabs].sort((a, b) => b.pinned - a.pinned);
	const draggableItems = sortedTabs.filter(item => !item.pinned).map(item => item.id);

	const activeTab = tabs.find(tab => tab.url === location.pathname);
	const openedTab = tabs.find(tab => tab.id === openedId);

	useEffect(() => {
		const closeModal = () => {
			setIsOpenedPin(false);
		};
		document.addEventListener('click', closeModal);
		return () => document.removeEventListener('click', closeModal);
	}, []);


	const handleRightClick = (e, id) => {
		e.preventDefault();
		if (e.button === 2) {
			setOpenedId(id);
			setContextPosition({ x: e.pageX, y: e.pageY });
			setIsOpenedPin(true);
		}
	};

	const handlePin = (id) => {
		const updatedTabs = tabs.map(tab => tab.id === id ? { ...tab, pinned: !tab.pinned } : tab);
		setTabs(updatedTabs);
		setIsOpenedPin(false);
	};

	const handleDragEnd = (e) => {
		const { active, over } = e;
		if (!over || active.id === over.id) return;

		const pinnedTabs = tabs.filter(tab => tab.pinned === true);
		const sortedDraggable = tabs.filter(tab => !tab.pinned);

		const oldIndex = sortedDraggable.findIndex(tab => tab.id === active.id);
		const newIndex = sortedDraggable.findIndex(tab => tab.id === over.id);
		const updatedDraggable = arrayMove(sortedDraggable, oldIndex, newIndex);

		const newTabs = [...pinnedTabs, ...updatedDraggable];
		setTabs(newTabs);
	};

	const handleDeleteTab = (id) => {
		const filteredTabs = tabs.filter(tab => tab.id !== id);
		setTabs(filteredTabs);
	};

	return (
		<div className="tabs-container">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={draggableItems} strategy={verticalListSortingStrategy}>
					<div className="tabs-wrapper">
						{tabs.map(tab => (
							<SortableTab
								key={tab.id}
								tab={tab}
								isActive={location.pathname === tab.url}
								onRightClick={handleRightClick}
								isDraggable={!tab.pinned}
							>
								{tab.title}
							</SortableTab>
						))}
					</div>
				</SortableContext>
			</DndContext>

			{isOpenedPin && openedId && (
				<div className="context-menu" style={{
					position: 'absolute',
					top: contextPosition.y,
					left: contextPosition.x,
					background: '#fff',
					border: '1px solid #ccc',
					boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
					zIndex: 20
				}}>
					<button onClick={() => handlePin(openedId)} style={{ display: 'block', width: '100%' }}>
						{openedTab?.pinned ? 'Відкріпити' : 'Закріпити'}
					</button>
					<button onClick={() => handleDeleteTab(openedId)} style={{ display: 'block', width: '100%' }}>
						Видалити
					</button>
				</div>
			)}

			<div className="tab-content" style={{ marginTop: '20px' }}>
				{activeTab ? <div>{activeTab.title} контент</div> : null}
			</div>
		</div>
	);
}

export default TabsContainer;