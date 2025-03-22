
"use client"
import { useEffect, useState } from "react";
import type { User } from "@repo/types";
// import { Button } from "@/components/ui/button"
import { Button } from "@repo/ui"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"





const User = () => {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("http://localhost:3024/user", {
                    method: "GET",
                });
                const data: User[] = await res.json();
                console.log(data)
                const activeUser = data.filter(user => user.status === "ACTIVE")
                setData(activeUser); // Store the fetched data in state
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }



    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((user) => (
                <Card key={user.id} className="">
                    <CardHeader>
                        <CardTitle>{`${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Title: {user.title}</p>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                        <p>Age: {user.age}</p>
                        <p>Country: {user.country}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">View Profile</Button>
                        <Button>Contact</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};




export default User