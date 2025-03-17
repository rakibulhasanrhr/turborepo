import { UserDTO } from "../dto/create.user.dto";

export interface CreateUser {
    name: string;
    title: string;
    status: "ACTIVE" | "INACTIVE";
    email: string;
    phone: string;
    age: number;
    country: string;
    createdAt: Date;
}

export interface User extends UserDTO {
    id?: string;
    name: string;
    title: string;
    status: "ACTIVE" | "INACTIVE";
    email: string;
    phone: string;
    age: number;
    country: string;
    createdAt: Date;
}
