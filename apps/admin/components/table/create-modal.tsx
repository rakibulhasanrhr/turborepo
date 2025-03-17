import React, { useState } from 'react';
import { X } from 'lucide-react'; // Using lucide-react for the close icon
import { CreateUser, User } from '@repo/types';
import { Button } from '../ui/button';

interface CreateUserModalProps {
    onSave: (user: User) => Promise<void>;
    onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onSave, onClose }) => {
    const [newUser, setNewUser] = useState<CreateUser>({
        name: '',
        email: '',
        phone: '',
        title: '',
        country: '',
        age: 0,
        status: 'ACTIVE', // Default to active status
        createdAt: new Date(),
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) : value,
        }));
    };

    const validateForm = () => {
        const requiredFields = ['name', 'email', 'phone', "title", 'country', 'age'];
        for (const field of requiredFields) {
            if (!newUser[field as keyof CreateUser]) {
                setError(`Please fill in the ${field}`);
                return false;
            }
        }
        setError(null);
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch('http://localhost:3006/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const createdUser = await response.json();
            await onSave(createdUser);
            onClose();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-end items-start z-50">
            <div className="bg-white w-1/2 h-full p-8 rounded-lg shadow-lg overflow-y-auto">
                {/* Header with Create User title and close button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Create New User</h2>
                    <Button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <X size={24} />
                    </Button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Input fields for new user data */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newUser.name}
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
                        value={newUser.email}
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
                        value={newUser.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newUser.title}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country:
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={newUser.country}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age:
                    </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={newUser.age}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status:
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={newUser.status}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                        Create
                    </Button>
                    <Button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
