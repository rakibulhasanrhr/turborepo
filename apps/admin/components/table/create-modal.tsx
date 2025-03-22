import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";

interface FormField {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];  // For select fields like status, if needed
}

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiEndpoint: string;
    method: "POST" | "PUT";
    fields: FormField[];
    initialData: Record<string, any>; // Initial data for the form (for editing or setting default values)
    setData: React.Dispatch<React.SetStateAction<any[]>>; // Update the data after submitting the form
}

function CreateUserModal({
    isOpen,
    onClose,
    apiEndpoint,
    method,
    fields,
    initialData,
    setData,
}: CreateModalProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "age" ? Number(value) : value, // Handle age as a number
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(apiEndpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit data");
            }

            const data = await response.json();
            console.log("Data submitted:", data);
            setData((prevData) => [...prevData, data]); // Add the new data to the list

            onClose(); // Close the modal after successful submission
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            setError(errorMessage);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay />
            <DialogContent>
                <DialogTitle>{method === "POST" ? "Create New Entry" : "Edit Entry"}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name}>
                            <Label htmlFor={field.name}>{field.label}</Label>
                            {field.type === "select" ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    required={field.required}
                                >
                                    {field.options?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                    <Button type="submit">{method === "POST" ? "Submit" : "Update"}</Button>
                </form>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}

export default CreateUserModal;
