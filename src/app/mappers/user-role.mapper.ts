import { UserRole } from "../enums/user-role";

export interface RoleMetadata {
  label: string;
  badgeClass: string;
  icon: string;
  description: string;
}

export const USER_ROLE_DETAILS: Record<UserRole, RoleMetadata> = {
  [UserRole.SuperAdmin]: { 
    label: 'System Director', 
    badgeClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-800/50', 
    icon: 'shield_person',
    description: 'Full Infrastructure Access'
  },
  [UserRole.InventoryManager]: { 
    label: 'Inventory Manager', 
    badgeClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-800/50', 
    icon: 'inventory',
    description: 'Procurement & Logistics'
  },
  [UserRole.Technician]: { 
    label: 'Technician', 
    badgeClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/50', 
    icon: 'construction',
    description: 'Maintenance & Support'
  },
  [UserRole.Employee]: { 
    label: 'Employee', 
    badgeClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/50', 
    icon: 'account_circle',
    description: 'Personal Asset Access'
  }
};