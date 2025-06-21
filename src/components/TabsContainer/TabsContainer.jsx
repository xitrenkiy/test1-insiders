import { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { NavLink, useLocation } from 'react-router-dom';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import SortableTab from '../SortableTab/SortableTab';

import './TabsContainer.css';

function TabsContainer() {
	const [tabs, setTabs] = useLocalStorage();
	const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
	const [openedId, setOpenedId] = useState(null);
	const [isOpenedPin, setIsOpenedPin] = useState(false);
	const [visibleTabs, setVisibleTabs] = useState([]);
	const [overflowTabs, setOverflowTabs] = useState([]);
	const [isOverflowOpen, setIsOverflowOpen] = useState(false);
	const sensors = useSensors(useSensor(PointerSensor));
	const location = useLocation();
	const tabsWrappedRef = useRef(null);

	const sortedTabs = [...tabs].sort((a, b) => b.pinned - a.pinned);
	const draggableItems = sortedTabs.filter(item => !item.pinned).map(item => item.id);

	const openedTab = tabs.find(tab => tab.id === openedId);

	useEffect(() => {
		const closeModal = () => {
			setIsOpenedPin(false);
			setIsOverflowOpen(false);
		};
		document.addEventListener('click', closeModal);
		return () => document.removeEventListener('click', closeModal);
	}, []);

	useEffect(() => {
		setVisibleTabs(sortedTabs);
		setOverflowTabs([]);
		
		const timer = setTimeout(() => {
			updateVisibilityTabs();
		}, 100);
		
		return () => clearTimeout(timer);
	}, [tabs]);

	useEffect(() => {
		const handleResize = debounce(() => {
			updateVisibilityTabs();
		}, 150);
		
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [sortedTabs]);

	const updateVisibilityTabs = () => {
		const wrapper = tabsWrappedRef.current;
		if (!wrapper || sortedTabs.length === 0) return;

		requestAnimationFrame(() => {
			const containerWidth = window.innerWidth;
			const overflowButtonWidth = 45;
			const tabElements = wrapper.querySelectorAll('.sortable-tab');

			let totalWidth = 0;
			let visibleCount = sortedTabs.length;
			const tabWidths = [];

			for (let el of tabElements) {
				const width = el.getBoundingClientRect().width || 150;
				tabWidths.push(width);
				totalWidth += width;
			}

			if (totalWidth <= containerWidth) {
				setVisibleTabs(sortedTabs);
				setOverflowTabs([]);
				return;
			}

			const availableWidth = containerWidth - overflowButtonWidth;
			let currentWidth = 0;
			visibleCount = 0;

			for (let w of tabWidths) {
				if (currentWidth + w <= availableWidth) {
					currentWidth += w;
					visibleCount++;
				} else break;
			}

			if (visibleCount === 0) visibleCount = 1;

			setVisibleTabs(sortedTabs.slice(0, visibleCount));
			setOverflowTabs(sortedTabs.slice(visibleCount));
		});
	};

	const debounce = (func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

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
					<div 
						className="tabs-wrapper" 
						ref={tabsWrappedRef} 
					>
						{visibleTabs.map(tab => (
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

			{overflowTabs.length > 0 && (
				<div className="tabs-overflow" style={{ position: 'relative', display: 'inline-block' }}>
					<button onClick={(e) => {
						e.stopPropagation();
						setIsOverflowOpen(!isOverflowOpen);
					}}>{isOverflowOpen ? '↑' : '↓'}</button>
					{isOverflowOpen && (
						<div className="overflow-menu">
							{overflowTabs.map(tab => (
								<NavLink onContextMenu={(e) => handleRightClick(e, tab.id)} to={tab.url} key={tab.id} className="tab-item" style={{ padding: '5px 10px' }}>
									{tab.title}
								</NavLink>
							))}
						</div>
					)}
				</div>
			)}

			{isOpenedPin && openedId && (
				<div className="context-menu" style={{
					position: 'absolute',
					top: contextPosition.y,
					left: contextPosition.x,
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
		</div>
	);
}

export default TabsContainer;
