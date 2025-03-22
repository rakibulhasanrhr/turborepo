import { useState } from "react";
import { Input } from "@/components/ui/input";
import { User } from "../../../../packages/types/src/users/interfaces/user.interface";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

function CreateUserModal({ isOpen, onClose, setData }: { isOpen: boolean, onClose: () => void, setData: React.Dispatch<React.SetStateAction<User[]>> }) {
    const [user, setUser] = useState<User>({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        age: 0,
        country: "",
        title: "",
        status: "ACTIVE"
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: name === "age" ? Number(value) : value
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch("http://localhost:3024/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error("Failed to create user");
            }

            const data = await response.json();
            console.log("User created:", data);
            setData((prevData) => [...prevData, data]);


            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            setError(errorMessage);
        }

    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay />
            <DialogContent>
                <DialogTitle>Create New User</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" value={user.firstName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input id="middleName" name="middleName" value={user.middleName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={user.lastName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={user.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={user.title} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={user.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" value={user.age} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" value={user.country} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <select id="status" name="status" value={user.status} onChange={handleChange} required>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}
export default CreateUserModal;
