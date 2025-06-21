import { useState, useEffect } from 'react';
import { defaultTabs } from '../components/DefaultTabs/DefaultTabs';

const useLocalStorage = (key = 'tabs') => {
	const [tabs, setTabs] = useState(() => {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultTabs;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(tabs));
	}, [key, tabs]);

	return [tabs, setTabs];
}

export default useLocalStorage;