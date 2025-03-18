"use client";
import { cn } from "../../../../lib/utils";
import { useEffect, useState } from "react";
import { User } from "@repo/types";




export function CardDemo() {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("http://localhost:3006/user", {
                    method: "GET",
                });
                const data = await res.json();
                setData(data); // Store the fetched data in state
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return (
        <div className="max-w-xs w-full group/card">
            {isLoading ? (
                <div>Loading...</div> // Show loading text while data is fetching
            ) : (
                data.map((user) => (
                    <div
                        key={user.id} // Assuming 'id' is a unique identifier for each user
                        className={cn(
                            "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
                            "bg-[url(https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)] bg-cover"
                        )}
                    >
                        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

                        <div className="text content">
                            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                                {user.title} {/* Dynamically set user title */}
                            </h1>
                            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
                                {user.description} {/* Dynamically set user description */}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
