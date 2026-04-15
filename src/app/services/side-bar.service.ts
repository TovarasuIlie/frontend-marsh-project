import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SideBarService {
	isCollapsed = signal(window.innerWidth < 768);

	toggle() {
		this.isCollapsed.update(v => !v);
	}
}