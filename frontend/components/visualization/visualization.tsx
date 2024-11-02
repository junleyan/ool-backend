import { Dispatch, FC, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { State } from "@/app/page";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface VisualizationProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Visualization: FC<VisualizationProps> = ({ state, dispatch }) => {
    const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);

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
                // Set sorting to ascending if no sort or a different column is clicked
                return { column: columnKey, direction: "asc" };
            } else if (currentConfig.direction === "asc") {
                // Set to descending if currently ascending
                return { column: columnKey, direction: "desc" };
            } else if (currentConfig.direction === "desc") {
                // Clear sorting if currently descending
                return null;
            }
            return currentConfig;
        });
    };

    return (
        <>
            <Tabs defaultValue="overview" className="my-4 mx-5">
                <TabsList>
                    <TabsTrigger autoFocus value="overview">Overview</TabsTrigger>
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
                                        <CardTitle>{state.selectedDataset?.title}</CardTitle>
                                        <CardDescription>Showing {state.csv.length} {state.csv.length > 1 ? "entries" : "entry"}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid">
                                        <ScrollArea className="grid max-h-[calc(100vh-280px)]">
                                            <Table>
                                                <TableCaption>END OF TABLE</TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        {Object.keys(state.csv[0] || {}).map((key) => (
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
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sortedData.map((row, index) => (
                                                        <TableRow key={index}>
                                                            {Object.values(row).map((value, idx) => (
                                                                <TableCell key={idx} className="text-center">{value}</TableCell>
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
