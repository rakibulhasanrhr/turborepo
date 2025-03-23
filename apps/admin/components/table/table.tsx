"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiDeleteBinLine,
    RiErrorWarningLine,
    RiMoreLine,
} from "@remixicon/react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { cn } from "@/lib/utils";
import { User } from "@repo/types"
import EditUserModal from "./modal";
import CreateUserModal from "./create-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Input } from "../ui/input";

interface UserData {
    data: User[];
    setData: React.Dispatch<React.SetStateAction<User[]>>;
}


interface TableProps {
    apiEndpoint: string;
}

//setting up the col with the data
const getColumns = ({ data, setData }: UserData): ColumnDef<User>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => {
            const id = row.getValue("id");
            const formattedId = `ID-${(id as string).slice(0, 6)}-${new Date().getFullYear()}`;
            return (
                <span className="text-muted-foreground">{formattedId}</span>
            );
        },
        size: 120,
    },
    {
        header: "Name",
        accessorFn: (row) => {
            const firstName = row.firstName;
            const middleName = row.middleName;
            const lastName = row.lastName;
            return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
        },
        cell: ({ row }) => {
            // Use row.original to access the raw data from the row
            const { firstName, middleName, lastName } = row.original;
            const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;

            return (
                <div className="flex items-center gap-3">
                    <div className="font-medium">{fullName}</div>
                </div>
            );
        },

    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium overflow-hidden text-ellipsis whitespace-normal break-words w-full">{row.getValue("title")}</div>
            </div>
        ),
        size: 260,
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium overflow-hidden text-ellipsis whitespace-normal break-words w-full">{row.getValue("email")}</div>
            </div>
        ),
        size: 250,
    },
    {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium">{row.getValue("phone")}</div>
            </div>
        ),
        size: 150,
    },
    {
        header: "Age",
        accessorKey: "age",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium">{row.getValue("age")}</div>
            </div>),
        size: 60,
    },
    {
        header: "Country",
        accessorKey: "country",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium">{row.getValue("country")}</div>
            </div>),
        size: 200,
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            const statusColor = status === "ACTIVE" ? "text-green-500" : "text-red-500"; // Green for active, red for inactive
            return (
                <div className="flex items-center h-full">
                    <div className={`font-small ${statusColor}`}>{status as string}</div>
                </div>
            );
        },
        size: 100,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
            <RowActions setData={setData} data={data} item={row.original} />
        ),
        size: 60,
        enableHiding: false,
    },
];


export default function ContactsTable({ apiEndpoint }: TableProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const columns = useMemo(() => getColumns({ data, setData }), [data]);
    const [searchTerm, setSearchTerm] = useState('');


    //fetch the data
    // useEffect(() => {
    //     async function fetchPosts() {
    //         try {
    //             const res = await fetch("http://localhost:3024/user", {
    //                 method: "GET"
    //             });
    //             const data = await res.json();
    //             setData(data);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //     fetchPosts();
    // }, []);

    //reuse able components useeffect

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch(apiEndpoint, {
                    method: "GET"
                });
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    }, [apiEndpoint]);




    //Modal
    const handleModal = async () => {
        setIsModalOpen(true)
        console.log("modal clicked")
    }

    const handleDeleteMulti = async () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
        console.log(selectedIds)
        try {
            const response = await fetch(apiEndpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids: selectedIds }), // Pass selected row IDs
            });

            if (!response.ok) {
                throw new Error("Failed to delete users");
            }
            const data = await response.json();
            console.log(data)
            setData((prevData) => prevData.filter((user) => !selectedIds.includes(user.id)));
            table.resetRowSelection();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting users:", error);
        }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        setSearchTerm(searchQuery);

        if (searchQuery) {
            try {
                const response = await fetch(`${apiEndpoint}?name=${searchQuery}`);
                const data = await response.json();
                console.log(data); // Handle the data as per your requirements
                setData(data)
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }

    };


    // Table Mechanism
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),


    });

    return (
        <div className="space-y-4">
            <div className="flex">
                <div>
                    <Button variant='outline' onClick={handleModal}>Create User</Button>
                    <CreateUserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        setData={setData}
                        apiEndpoint={apiEndpoint}
                        method="POST"
                        fields={[
                            { name: "firstName", label: "First Name", type: "text", required: true },
                            { name: "lastName", label: "Last Name", type: "text", required: true },
                            { name: "email", label: "Email", type: "email", required: true },
                            { name: "phone", label: "Phone", type: "text", required: true },
                            { name: "title", label: "Title", type: "text", required: true },
                            { name: "country", label: "Country", type: "text", required: true },
                            { name: "age", label: "age", type: "text", required: true },
                        ]}
                        initialData={{ firstName: "", lastName: "", email: "", phone: "", title: "", country: "", age: 0 }}
                    />
                </div>
                <div >
                    {/* Delete button */}
                    {table.getSelectedRowModel().rows.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="ml-auto" variant="outline">
                                    <RiDeleteBinLine
                                        className="-ms-1 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Delete
                                    <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {table.getSelectedRowModel().rows.length}
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                                    <div
                                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                                        aria-hidden="true"
                                    >
                                        <RiErrorWarningLine className="opacity-80" size={16} />
                                    </div>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete{" "}
                                            {table.getSelectedRowModel().rows.length} selected{" "}
                                            {table.getSelectedRowModel().rows.length === 1
                                                ? "row"
                                                : "rows"}
                                            .
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteMulti}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                </div>
            </div>
            <Input id="search" name="search" placeholder="Search Name Here" value={searchTerm}
                onChange={handleSearch} className="w-1/5" />

            {/* Table */}
            <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: `${header.getSize()}px` }}
                                        className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                                    >
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <div
                                                className={cn(
                                                    header.column.getCanSort() &&
                                                    "flex h-full cursor-pointer select-none items-center gap-2",
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                                onKeyDown={(e) => {
                                                    // Enhanced keyboard handling for sorting
                                                    if (
                                                        header.column.getCanSort() &&
                                                        (e.key === "Enter" || e.key === " ")
                                                    ) {
                                                        e.preventDefault();
                                                        header.column.getToggleSortingHandler()?.(e);
                                                    }
                                                }}
                                                tabIndex={header.column.getCanSort() ? 0 : undefined}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {{
                                                    asc: (
                                                        <RiArrowUpSLine
                                                            className="shrink-0 opacity-60"
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                    ),
                                                    desc: (
                                                        <RiArrowDownSLine
                                                            className="shrink-0 opacity-60"
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                    ),
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <tbody aria-hidden="true" className="table-row h-1"></tbody>
                <TableBody>
                    {isLoading ? (
                        <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <tbody aria-hidden="true" className="table-row h-1"></tbody>
            </Table>

            {/* Pagination */}
            {table.getRowModel().rows.length > 0 && (
                <div className="flex items-center justify-between gap-3">
                    <p
                        className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
                        aria-live="polite"
                    >
                        Page{" "}
                        <span className="text-foreground">
                            {table.getState().pagination.pageIndex + 1}
                        </span>{" "}
                        of <span className="text-foreground">{table.getPageCount()}</span>
                    </p>
                    <Pagination className="w-auto">
                        <PaginationContent className="gap-3">
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    Previous
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    Next
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}

function RowActions({
    setData,
    data,
    item,
}: {
    setData: React.Dispatch<React.SetStateAction<User[]>>;
    data: User[];
    item: User;
}) {
    const [users, setUsers] = useState<User[]>([]); // Array of users

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    const handleDelete = async (itemId?: string) => {
        try {
            const res = await fetch("http://localhost:3024/user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: [itemId],  // Send the ID in an array
                }),
            });
            if (!res.ok) {
                throw new Error("Failed to delete user");
            }
            //get the updated data
            const updatedData = data.filter((dataItem) => dataItem.id !== itemId);
            // Update the table with the new data
            setData(updatedData);
            console.log("User deleted successfully", data[0].id);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    const handleEditToggle = (user: User) => {
        setSelectedUser(user); // Set the selected user
        setIsModalOpen(true); // Open the modal
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="flex justify-end">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="shadow-none text-muted-foreground/60"
                            aria-label="Edit item"
                        >
                            <RiMoreLine className="size-5" size={20} aria-hidden="true" />
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => handleEditToggle(item)} // Pass selected user data
                            disabled={false} // Update with actual logic for disabling
                        >
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => handleDelete(item.id)} // Handle delete logic here
                        variant="destructive"
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {isModalOpen && selectedUser && (
                <EditUserModal
                    fields={[
                        { name: "firstName", label: "First Name", type: "text" },
                        { name: "lastName", label: "Last Name", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "phone", label: "Phone", type: "text" },
                        { name: "title", label: "Title", type: "text" },
                        { name: "country", label: "Country", type: "text" },
                        { name: "age", label: "Age", type: "number" },
                        { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] },
                    ]}
                    apiEndpoint={`http://localhost:3024/user/${selectedUser.id}`}
                    method="PATCH"
                    data={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    setData={setData}
                />


            )}



        </>
    );

}
