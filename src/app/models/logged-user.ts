import { UserRole } from "../enums/user-role";

export interface LoggedUser {
    name: string,
    email: string,
    location:string,
    role: UserRole
    token: string,
}
