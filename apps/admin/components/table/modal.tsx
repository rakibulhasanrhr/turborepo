
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface EditModalProps<T> {
    data: T;
    onClose: () => void;
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    fields: { name: keyof T; label: string; type: string; options?: string[] }[];
    apiEndpoint: string;
    method: "PATCH" | "PUT";
}

const EditUserModal = <T extends Record<string, any>>({
    data,
    onClose,
    setData,
    fields,
    apiEndpoint,
    method,
}: EditModalProps<T>) => {
    const [updatedData, setUpdatedData] = useState<T>(data);

    useEffect(() => {
        setUpdatedData(data);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedData({
            ...updatedData,
            [name]: name === "age" ? Number(value) : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(apiEndpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update data");
            }

            const updatedItem = await response.json();

            setData((prevData) =>
                prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            );

            onClose();
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-end items-start z-50">
            <div className="bg-white w-1/2 h-full p-8 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Edit Data</h2>
                    <Button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <X size={24} />
                    </Button>
                </div>

                <form>
                    {fields.map((field) => (
                        <div className="mb-4" key={field.name as string}>
                            <label
                                htmlFor={field.name as string}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.label}
                            </label>

                            {field.type === "select" ? (
                                <select
                                    id={field.name as string}
                                    name={field.name as string}
                                    value={updatedData[field.name]}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                >
                                    {field.options?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name as string}
                                    name={field.name as string}
                                    value={updatedData[field.name]}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex space-x-4">
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            Save
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;


