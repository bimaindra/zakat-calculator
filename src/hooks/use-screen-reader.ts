import { useCallback, useRef } from 'react';

interface AnnouncementOptions {
	priority?: 'polite' | 'assertive';
	delay?: number;
}

export const useScreenReader = () => {
	const announcerRef = useRef<HTMLDivElement | null>(null);

	const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
		const { priority = 'polite', delay = 100 } = options;

		// Create or get the announcer element
		if (!announcerRef.current) {
			announcerRef.current = document.createElement('div');
			announcerRef.current.setAttribute('aria-live', priority);
			announcerRef.current.setAttribute('aria-atomic', 'true');
			announcerRef.current.setAttribute('role', 'status');
			announcerRef.current.style.position = 'absolute';
			announcerRef.current.style.left = '-10000px';
			announcerRef.current.style.width = '1px';
			announcerRef.current.style.height = '1px';
			announcerRef.current.style.overflow = 'hidden';
			document.body.appendChild(announcerRef.current);
		}

		// Update priority if different
		if (announcerRef.current.getAttribute('aria-live') !== priority) {
			announcerRef.current.setAttribute('aria-live', priority);
		}

		// Clear previous content and announce new message
		setTimeout(() => {
			if (announcerRef.current) {
				announcerRef.current.textContent = message;
			}
		}, delay);

		// Clear message after a reasonable time to avoid repetition
		setTimeout(() => {
			if (announcerRef.current) {
				announcerRef.current.textContent = '';
			}
		}, delay + 3000);
	}, []);

	const announceError = useCallback((message: string) => {
		announce(`Kesalahan: ${message}`, { priority: 'assertive' });
	}, [announce]);

	const announceSuccess = useCallback((message: string) => {
		announce(`Berhasil: ${message}`, { priority: 'polite' });
	}, [announce]);

	const announceStatus = useCallback((message: string) => {
		announce(message, { priority: 'polite' });
	}, [announce]);

	const announceNavigation = useCallback((message: string) => {
		announce(message, { priority: 'polite', delay: 50 });
	}, [announce]);

	return {
		announce,
		announceError,
		announceSuccess,
		announceStatus,
		announceNavigation,
	};
};