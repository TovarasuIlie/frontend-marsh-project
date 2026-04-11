import { UserRole } from "../enums/user-role";

export interface EditUserForm {
    name: string,
    role: UserRole,
    location: string,
}
