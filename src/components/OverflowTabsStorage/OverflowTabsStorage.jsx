import { useState, useEffect, useRef} from 'react';

const OverflowTabsStorage = ({ tabs }) => {
	const tabsWrappedRef = useRef(null);
	const [visibleTabs, setVisibleTabs] = useState(tabs);
	const [overflowTabs, setOverflowTabs] = useState([]);

	console.log(overflowTabs)



	return (
		<div className="tabs-container">
			<div className="tabs-wrapper" ref={tabsWrappedRef} style={{ display: 'flex', overflow: 'hidden' }}>
				{visibleTabs.map(tab => (
				<div key={tab.id} className="tab-item">
					{tab.title}
				</div>
				))}
			</div>

			{overflowTabs.length > 0 && (
				<div className="tabs-overflow">
				<button>⋯</button>
				<div className="overflow-menu">
					{overflowTabs.map(tab => (
					<div key={tab.id} className="tab-item">
						{tab.title}
					</div>
					))}
				</div>
				</div>
			)}
		</div>
	)
}

export default OverflowTabsStorage;