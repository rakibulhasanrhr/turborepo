import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { User } from "../../../../packages/types/src/users/interfaces/user.interface";
import { X } from "lucide-react";

interface EditUserModalProps {
    user: User; // The user being edited
    onClose: () => void; // Function to handle closing the modal
    setData: React.Dispatch<React.SetStateAction<User[]>>; // Function to update the parent data
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, setData }) => {
    const [updatedUser, setUpdatedUser] = useState<User>(user);


    useEffect(() => {
        setUpdatedUser(user);
    }, [user]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedUser({
            ...user,
            [name]: name === "age" ? Number(value) : value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:3006/user/${updatedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const data = await response.json();

            setData((prevData) => prevData.map((u) => (u.id === data.id ? data : u)));

            // Notify parent component that the user was updated

            onClose();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-end items-start z-50">
            <div className="bg-white w-1/2 h-full p-8 rounded-lg shadow-lg overflow-y-auto">
                {/* Header and form */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Edit User</h2>
                    <Button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <X size={24} />
                    </Button>
                </div>

                {/* Editable fields */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={updatedUser.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Other fields */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={updatedUser.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone:
                    </label>
                    <input
                        type="phone"
                        id="phone"
                        name="phone"
                        value={updatedUser.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age:
                    </label>
                    <input
                        type="age"
                        id="age"
                        name="age"
                        value={updatedUser.age}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country:
                    </label>
                    <input
                        type="country"
                        id="country"
                        name="country"
                        value={updatedUser.country}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>


                {/* Status dropdown */}
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status:
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={updatedUser.status}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                {/* Save and Cancel buttons */}
                <Button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
                    Save
                </Button>
                <Button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none">
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default EditUserModal