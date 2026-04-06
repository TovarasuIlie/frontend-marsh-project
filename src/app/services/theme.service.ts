import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {

	darkMode = signal<boolean>(
		localStorage.getItem('theme') === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);
	constructor() {
		this.applyTheme();
	}

	toggleTheme() {
		this.darkMode.update(v => !v);
		this.applyTheme();
	}

	private applyTheme() {
		if (this.darkMode()) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
}