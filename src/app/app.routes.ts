import { Routes } from '@angular/router';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { IndexPageComponent } from './components/pages/index-page/index-page.component';
import { InventoryPageComponent } from './components/pages/inventory-page/inventory-page.component';
import { AssignmentPageComponent } from './components/pages/assignment-page/assignment-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { EmployeesPageComponent } from './components/pages/employees-page/employees-page.component';
import { adminGuard } from './guards/admin.guard';
import { inventoryManagerGuard } from './guards/inventory-manager.guard';

export const routes: Routes = [
    {
        path: "",
        component: PageLayoutComponent,
        children: [
            {
                path: "",
                component: IndexPageComponent,
                canActivate: [authGuard]
            },
            {
                path: "inventory",
                component: InventoryPageComponent,
                canActivate: [authGuard, inventoryManagerGuard]
            },
            {
                path: "assignments",
                component: AssignmentPageComponent,
                canActivate: [authGuard]
            },
            {
                path: "employees",
                component: EmployeesPageComponent,
                canActivate: [authGuard, adminGuard]
            }
        ]
    },
    {
        path: "register",
        component: RegisterPageComponent,
        canActivate: [guestGuard]
    },
    {
        path: "login",
        component: LoginPageComponent,
        canActivate: [guestGuard]
    }
];
