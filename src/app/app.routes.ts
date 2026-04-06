import { Routes } from '@angular/router';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { IndexPageComponent } from './components/pages/index-page/index-page.component';
import { InventoryPageComponent } from './components/pages/inventory-page/inventory-page.component';
import { AssignmentPageComponent } from './components/pages/assignment-page/assignment-page.component';

export const routes: Routes = [
    {
        path: "",
        component: PageLayoutComponent,
        children: [
            {
                path: "",
                component: IndexPageComponent
            },
            {
                path: "inventory",
                component: InventoryPageComponent
            },
            {
                path: "assignments",
                component: AssignmentPageComponent
            }
        ]
    }
];
