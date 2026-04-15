import { User } from "./user"

export interface Device {
    id: number,
    name: string,
    manufacturer: string,
    type: number,
    assignedToUser?: User
    operatingSystem: string,
    osVersion: string,
    processor: string,
    ramAmount: number,
    description: string
}
