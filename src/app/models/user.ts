import { UserRole } from "../enums/user-role";
import { Device } from "./device";

export interface User {
    id: number,
    name: string,
    email: string,
    role: UserRole,
    location: string,
    devices?: Device[] 
}