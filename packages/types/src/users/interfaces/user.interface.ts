import { UserDTO } from "../dto/create.user.dto";


export interface User extends UserDTO {
    id?: string
    status: "ACTIVE" | "INACTIVE"
}
