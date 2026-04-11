import { UserRole } from "../enums/user-role";

export interface RoleMetadata {
	label: string;
	badgeClass: string;
	icon: string;
}

export const USER_ROLE_DETAILS: Record<UserRole, RoleMetadata> = {
	[UserRole.Admin]: {
		label: 'System Director',
		badgeClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-800/50',
		icon: 'shield'
	},
	[UserRole.InventoryManager]: {
		label: 'Inventory Manager',
		badgeClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-800/50',
		icon: 'inventory'
	},
	[UserRole.Employee]: {
		label: 'Employee',
		badgeClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/50',
		icon: 'account_circle'
	}
};