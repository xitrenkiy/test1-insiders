import { useEffect } from 'react';

export default function useResizeObserver(ref, callback) {
	useEffect(() => {
		if (!ref.current) return;
		const observer = new ResizeObserver(callback);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [ref, callback]);
}