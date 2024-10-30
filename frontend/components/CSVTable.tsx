import { FC, useState } from "react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
    EyeNoneIcon,
    MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "./ui/dropdown-menu";

interface CsvTableProps {
    csv: { [key: string]: string }[];
    title: string | null;
}

const CSVTable: FC<CsvTableProps> = ({ csv, title }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

    const SORTED_DATA = [...csv];
    if (sortConfig?.key) {
        SORTED_DATA.sort((a, b) => {
            const key = sortConfig.key;
            if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const handleSort = (column: string, direction: 'asc' | 'desc') => {
        setSortConfig({ key: column, direction });
    };

    const toggleHideColumn = (column: string) => {
        setHiddenColumns((prev) =>
            prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
        );
    };

    return (
        <div className="mx-5">
            <div className="flex items-center justify-between">
                <span className="ml-2">
                    Showing {csv.length} {csv.length > 1 ? "entries" : "entry"}
                    {title && <> from <b>{title}</b></>}
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="my-3 mr-1 focus:outline-none">
                            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="max-h-64 overflow-y-auto">
                            {Object.keys(csv[0] || {}).map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column}
                                    className="capitalize"
                                    checked={!hiddenColumns.includes(column)}
                                    onCheckedChange={() => toggleHideColumn(column)}
                                >
                                    {column}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="border rounded-lg">
                <ScrollArea className="max-h-96 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(csv[0] || {}).map((column) =>
                                    !hiddenColumns.includes(column) ? (
                                        <TableHead key={column}>
                                            <div className={cn("flex items-center space-x-2")}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="-ml-3 h-8 focus:outline-none">
                                                            <span>{column}</span>
                                                            {sortConfig?.key === column ? (
                                                                sortConfig.direction === "asc" ? (
                                                                    <ArrowUpIcon className="ml-2 h-4 w-4" />
                                                                ) : (
                                                                    <ArrowDownIcon className="ml-2 h-4 w-4" />
                                                                )
                                                            ) : (
                                                                <CaretSortIcon className="ml-2 h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start">
                                                        <DropdownMenuItem onClick={() => handleSort(column, 'asc')}>
                                                            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                                            Asc
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSort(column, 'desc')}>
                                                            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                                            Desc
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => toggleHideColumn(column)}>
                                                            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                                            Hide
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                    ) : null
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {SORTED_DATA.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    className="transition-transform duration-100 hover:shadow-lg hover:scale-[1.00075]"
                                >
                                    {Object.keys(row).map((column, colIndex) =>
                                        !hiddenColumns.includes(column) ? (
                                            <TableCell key={colIndex}>{row[column]}</TableCell>
                                        ) : null
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
};

export default CSVTable;
