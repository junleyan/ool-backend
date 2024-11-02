import { Dispatch, FC, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { State } from "@/app/page";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";

interface VisualizationProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Visualization: FC<VisualizationProps> = ({ state, dispatch }) => {
    const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({});
    
    useEffect(() => {
        setVisibleColumns(Object.keys(state.csv[0] || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [state.csv]);

    const sortedData = [...state.csv].sort((a, b) => {
        if (!sortConfig) return 0;

        const { column, direction } = sortConfig;
        const aVal = a[column];
        const bVal = b[column];

        const isNumeric = (val: any) => !isNaN(parseFloat(val)) && isFinite(val);

        if (isNumeric(aVal) && isNumeric(bVal)) {
            return direction === "asc"
                ? parseFloat(aVal) - parseFloat(bVal)
                : parseFloat(bVal) - parseFloat(aVal);
        } else {
            return direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        }
    });

    const toggleSorting = (columnKey: string) => {
        setSortConfig((currentConfig) => {
            if (!currentConfig || currentConfig.column !== columnKey) {
                return { column: columnKey, direction: "asc" };
            } else if (currentConfig.direction === "asc") {
                return { column: columnKey, direction: "desc" };
            } else if (currentConfig.direction === "desc") {
                return null;
            }
            return currentConfig;
        });
    };

    const toggleColumnVisibility = (columnKey: string) => {
        setVisibleColumns((prevState) => ({
            ...prevState,
            [columnKey]: !prevState[columnKey],
        }));
    };

    return (
        <>
            <Tabs defaultValue="overview" className="my-4 mx-5">
                <TabsList>
                    <TabsTrigger autoFocus value="overview">View Data Table</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                {
                    state.isLoadingCSV ?
                        (
                            <>
                                <TabsContent value="overview">Loading...</TabsContent>
                                <TabsContent value="analytics">Loading...</TabsContent>
                                <TabsContent value="reports">Loading...</TabsContent>
                                <TabsContent value="notifications">Loading...</TabsContent>
                            </>
                        )
                        :
                        (
                            <TabsContent value="overview">
                                <Card className="mt-4 grid">
                                    <CardHeader>
                                        <CardTitle className="items-center w-5/6">
                                            {state.selectedDataset?.title}
                                        </CardTitle>
                                        <CardDescription className="flex justify-between items-center">
                                            <div>Showing {state.csv.length} {state.csv.length > 1 ? "entries" : "entry"}</div>
                                            <div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="m-0">
                                                            <SlidersHorizontal className="h-4 w-4" />
                                                            <span className="ml-1">View</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-36">
                                                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <ScrollArea className="h-64">
                                                            {Object.keys(state.csv[0] || {}).map((key) => (
                                                                key !== "Title" && (
                                                                    <DropdownMenuCheckboxItem
                                                                        key={key}
                                                                        checked={visibleColumns[key]}
                                                                        onCheckedChange={() => toggleColumnVisibility(key)}
                                                                    >
                                                                        {key}
                                                                    </DropdownMenuCheckboxItem>
                                                                )
                                                            ))}
                                                        </ScrollArea>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardDescription>

                                    </CardHeader>
                                    <CardContent className="grid">
                                        <ScrollArea className="grid max-h-[calc(100vh-325px)]">
                                            <Table>
                                                <TableCaption>END OF TABLE</TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        {Object.keys(state.csv[0] || {}).map((key) => (
                                                            visibleColumns[key] && (
                                                                <TableHead key={key} className="text-center">
                                                                    <Button
                                                                        variant="ghost"
                                                                        onClick={() => toggleSorting(key)}
                                                                    >
                                                                        {key}
                                                                        {sortConfig?.column === key ? (
                                                                            sortConfig.direction === "asc" ? (
                                                                                <ArrowUp className="ml-2 h-4 w-4" />
                                                                            ) : (
                                                                                <ArrowDown className="ml-2 h-4 w-4" />
                                                                            )
                                                                        ) : (
                                                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </TableHead>
                                                            )
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sortedData.map((row, index) => (
                                                        <TableRow key={index}>
                                                            {Object.keys(row).map((key) => (
                                                                visibleColumns[key] && (
                                                                    <TableCell key={key} className="text-center">
                                                                        {row[key]}
                                                                    </TableCell>
                                                                )
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )
                }
            </Tabs>
        </>
    );
}

export default Visualization;
