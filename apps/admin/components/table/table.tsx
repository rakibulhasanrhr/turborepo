"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiErrorWarningLine,
    RiCloseCircleLine,
    RiDeleteBinLine,
    RiBardLine,
    RiFilter3Line,
    RiSearch2Line,
    RiMoreLine,
} from "@remixicon/react";
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    useTransition,
} from "react";
import { cn } from "@/lib/utils";
import { User, UserDTO } from "@repo/types"
import EditUserModal from "./modal";
import CreateUserModal from "./create-modal";


const statusFilterFn: FilterFn<User> = (
    row,
    columnId,
    filterValue: string[],
) => {
    if (!filterValue?.length) return true;
    const status = row.getValue(columnId) as string;
    return filterValue.includes(status);
};

interface UserData {
    data: User[];
    setData: React.Dispatch<React.SetStateAction<User[]>>;
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
        accessorKey: "name",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="font-medium">{row.getValue("name")}</div>
            </div>
        ),
        size: 160,
        enableHiding: false,
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium">{row.getValue("title")}</div>
            </div>
        ),
        size: 260,
        filterFn: statusFilterFn,
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
            <div className="flex items-center h-full">
                <div className="font-medium">{row.getValue("email")}</div>
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

export default function ContactsTable() {
    const id = useId();
    console.log(id)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "name",
            desc: false,
        },
    ]);

    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const columns = useMemo(() => getColumns({ data, setData }), [data]);
    const [user, setUsers] = useState<UserDTO[]>([]);
    //fetch the data
    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("http://localhost:3006/user", {
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
    }, []);
    //delete handleDelete
    const handleDeleteRows = async () => {
        const selectedRows = table.getSelectedRowModel().rows;

        const selectedIds = selectedRows.map((row) => row.original.id);
        console.log(selectedIds)

        if (selectedIds.length === 0) {
            console.log('No rows selected');
            return;
        }
        try {
            const response = await fetch('http://localhost:3006/user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete rows');
            }

            const updatedData = data.filter(
                (item) => !selectedRows.some((row) => row.original.id === item.id)
            );
            setData(updatedData);
            console.log('Updated rows:', updatedData);
            table.resetRowSelection();
        } catch (error) {
            console.error('Error deleting rows:', error);
        }
    };

    const handleModal = async () => {
        setIsModalOpen(true)
        console.log("modal clicked")
    }

    const handleNewUser = async (newUser: UserDTO) => {
        try {
            const response = await fetch('http://localhost:3006/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to save the user');
            }

            const savedUser = await response.json();

            // You can update your user list or state here
            setUsers((prevUsers) => [...prevUsers, savedUser]);

            // Optionally, show a success message, or take any other actions after saving
            console.log('User saved successfully:', savedUser);
        } catch (error) {
            console.error('Error saving user:', error);
            // Optionally, display an error notification to the user
        }
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            pagination,
            columnFilters,
            columnVisibility,
        },
    });

    // Extract complex expressions into separate variables
    const statusColumn = table.getColumn("status");
    const statusFacetedValues = statusColumn?.getFacetedUniqueValues();
    const statusFilterValue = statusColumn?.getFilterValue();

    // Update useMemo hooks with simplified dependencies
    // get the status from here
    const uniqueStatusValues = useMemo(() => {
        if (!statusColumn) return [];
        const values = Array.from(statusFacetedValues?.keys() ?? []);
        return values.sort();
    },
        [statusColumn, statusFacetedValues]);
    console.log("this is the uniqueStatusValues", uniqueStatusValues)
    const statusCounts = useMemo(() => {
        if (!statusColumn) return new Map();
        return statusFacetedValues ?? new Map();
    }, [statusColumn, statusFacetedValues]);

    console.log("this is the status count", statusCounts)

    const selectedStatuses = useMemo(() => {
        return (statusFilterValue as string[]) ?? [];
    }, [statusFilterValue]);
    console.log("this is the selectedStatuses", selectedStatuses)

    return (
        <div className="space-y-4">
            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    {/* Filter by name */}
                    <div className="relative">
                        <Input
                            id={`${id}-input`}
                            ref={inputRef}
                            className={cn(
                                "peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
                            )}
                            value={
                                (table.getColumn("name")?.getFilterValue() ?? "") as string
                            }
                            onChange={(e) =>
                                table.getColumn("name")?.setFilterValue(e.target.value)
                            }
                            placeholder="Search by name"
                            type="text"
                            aria-label="Search by name"
                        />
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
                            <RiSearch2Line size={20} aria-hidden="true" />
                        </div>
                        {Boolean(table.getColumn("name")?.getFilterValue()) && (
                            <Button
                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Clear filter"
                                onClick={() => {
                                    table.getColumn("name")?.setFilterValue("");
                                    if (inputRef.current) {
                                        inputRef.current.focus();
                                    }
                                }}
                            >
                                <RiCloseCircleLine size={16} aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                </div>
                {/* Right side */}
                <div className="flex items-center gap-3">
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
                                    <AlertDialogAction onClick={handleDeleteRows}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {/* Filter by status */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <RiFilter3Line
                                    className="size-5 -ms-1.5 text-muted-foreground/60"
                                    size={20}
                                    aria-hidden="true"
                                />
                                Filter
                                {selectedStatuses.length > 0 && (
                                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {selectedStatuses.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto min-w-36 p-3" align="end">
                            <div className="space-y-3">
                                <div className="text-xs font-medium uppercase text-muted-foreground/60">
                                    Status
                                </div>
                                <div className="space-y-3">
                                    {uniqueStatusValues.map((value, i) => (
                                        <div key={value} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`${id}-${i}`}
                                                checked={selectedStatuses.includes(value)}
                                            />
                                            <Label
                                                htmlFor={`${id}-${i}`}
                                                className="flex grow justify-between gap-2 font-normal"
                                            >
                                                {value}{" "}
                                                <span className="ms-2 text-xs text-muted-foreground">
                                                    {statusCounts.get(value)}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {/* New filter button */}
                    <Button variant="outline">
                        <RiBardLine
                            className="size-5 -ms-1.5 text-muted-foreground/60"
                            size={20}
                            aria-hidden="true"
                        />
                        New Filter
                    </Button>
                    <Button onClick={handleModal} variant="outline">
                        Create User
                        {/* Conditionally render the EditUserModal */}
                        {isModalOpen && (
                            <CreateUserModal
                                onSave={handleNewUser}
                                onClose={() => setIsModalOpen(false)} // Close modal
                            />
                        )}
                    </Button>

                </div>

            </div>

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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isUpdatePending, startUpdateTransition] = useTransition();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        startUpdateTransition(() => {
            const updatedData = data.filter((dataItem) => dataItem.id !== item.id);
            setData(updatedData);
            setShowDeleteDialog(false);
        });
    };


    const handleEditToggle = (user: User) => {
        setSelectedUser(user); // Set the selected user
        setIsModalOpen(true); // Open the modal
    };

    const handleSaveUser = async (updatedUser: User) => {
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

            // Update the local data state
            const updatedData = data.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            setData(updatedData); // Update the data state with the new user data
            console.log('User updated:', updatedData);
        } catch (error) {
            console.error('Error saving user:', error);
        }
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
                        onClick={handleDelete} // Handle delete logic here
                        variant="destructive"
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Conditionally render the EditUserModal */}
            {isModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onSave={handleSaveUser}
                    onClose={() => setIsModalOpen(false)} // Close modal
                />
            )}


        </>
    );

}
