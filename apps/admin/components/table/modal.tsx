import React, { useState, useEffect } from 'react';
import { User } from '@repo/types';
import { X } from 'lucide-react'; // Using lucide-react for the close icon
import { Button } from '../ui/button';

interface EditUserModalProps {
    user: User;
    onSave: (updatedUser: User) => Promise<void>;
    onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSave, onClose }) => {
    const [updatedUser, setUpdatedUser] = useState<User>(user);

    useEffect(() => {
        setUpdatedUser(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({
            ...prev,
            [name]: value, // Dynamically set the field values
        }));
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

            await onSave(updatedUser);
            onClose();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-end items-start z-50">
            <div className="bg-white w-1/2 h-full p-8 rounded-lg shadow-lg overflow-y-auto">
                {/* Header with Edit User title and close button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Edit User</h2>
                    <Button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <X size={24} />
                    </Button>
                </div>

                {/* Editable fields for user data */}
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
                        type="text"
                        id="phone"
                        name="phone"
                        value={updatedUser.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Other fields... */}
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


                <Button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    Save
                </Button>
                <Button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                    Cancel
                </Button>

            </div>
        </div>
    );
};

export default EditUserModal;
