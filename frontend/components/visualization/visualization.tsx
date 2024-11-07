import { Dispatch, FC, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { State } from "@/app/page";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown, SlidersHorizontal, CornerDownLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";
import Graph from "./graph";
import { data } from "@/utils/data";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { ChatInput } from "../ui/chat/chat-input";

interface VisualizationProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Visualization: FC<VisualizationProps> = ({ state, dispatch }) => {
    const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({});
    const [activeTab, setActiveTab] = useState<string>("table");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setVisibleColumns(Object.keys(state.csv[0] || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [state.csv]);

    useEffect(() => {
        if (!state.graphSetting && activeTab === "graph") {
            fetchGraphSetting();
        }
    }, [activeTab]);

    const fetchGraphSetting = async () => {
        if (state.selectedDataset) {
            const SAMPLE = JSON.stringify(state.csv.slice(0, Math.min(3, state.csv.length)));
            const DATA = await data.getXYAxis(`${state.selectedDataset.title.length > 0 && state.selectedDataset.title}\n${state.selectedDataset.notes.length > 0 && state.selectedDataset.notes}`, SAMPLE);
            dispatch({ type: "graphSetting", payload: DATA });
        }
    };

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

    const handleSendMessage = () => {
        if (message.trim()) {
            dispatch({ type: "chat", payload: [...state.chat, { type: "user", content: message }] });
            setMessage(""); // Clear input after sending
        }
    };

    return (
        <>
            <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="my-4 mx-5">
                <TabsList>
                    <TabsTrigger value="table">Data Table</TabsTrigger>
                    <TabsTrigger disabled={state.isLoadingCSV} value="graph">Chart</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                {
                    state.isLoadingCSV ?
                        (
                            <>
                                <TabsContent value="table">Loading...</TabsContent>
                                <TabsContent value="graph">Loading...</TabsContent>
                                <TabsContent value="chat">Loading...</TabsContent>
                                <TabsContent value="notifications">Loading...</TabsContent>
                            </>
                        )
                        :
                        (
                            <>
                                <TabsContent value="table">
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
                                                            <ScrollArea className="max-h-64">
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
                                <TabsContent value="graph">
                                    {
                                        state.graphSetting ?
                                            (
                                                state.graphSetting.graphable ?
                                                    <Graph
                                                        data={state.csv}
                                                        title={state.graphSetting.title}
                                                        subtitle={state.graphSetting.subtitle}
                                                        xAxisKey={state.graphSetting.x}
                                                        yAxisKeys={state.graphSetting.y} />
                                                    :
                                                    <>Cannot graph</>
                                            )
                                            :
                                            <>Loading...</>
                                    }
                                </TabsContent>
                                <TabsContent value="chat">
                                    <Card className="mt-5">
                                        <CardHeader>
                                            <CardTitle>Ask AI</CardTitle>
                                            <CardDescription>Ask AI questions you have for the dataset</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid">
                                            <ScrollArea className="flex flex-col h-[calc(100vh-375px)]">
                                                <div className="flex flex-col flex-grow space-y-3">
                                                    <div className="flex justify-start">
                                                        <ChatBubble variant="received">
                                                            <ChatBubbleAvatar fallback="AI" />
                                                            <ChatBubbleMessage variant="received">
                                                                Aloha! What question can I answer for you?
                                                            </ChatBubbleMessage>
                                                        </ChatBubble>
                                                    </div>
                                                    {
                                                        state.chat.map((msg) => {
                                                            return msg.type === 'user' ? (
                                                                <div className="flex justify-end mr-3">
                                                                    <ChatBubble variant="sent">
                                                                        <ChatBubbleAvatar fallback="You" />
                                                                        <ChatBubbleMessage variant="sent">
                                                                            {msg.content}
                                                                        </ChatBubbleMessage>
                                                                    </ChatBubble>
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-start">
                                                                    <ChatBubble variant="received">
                                                                        <ChatBubbleAvatar fallback="AI" />
                                                                        <ChatBubbleMessage variant="received">
                                                                            {msg.content}
                                                                        </ChatBubbleMessage>
                                                                    </ChatBubble>
                                                                </div>
                                                            );
                                                        })
                                                    }

                                                    <div className="flex justify-end mr-3">
                                                        <ChatBubble variant="sent">
                                                            <ChatBubbleAvatar fallback="You" />
                                                            <ChatBubbleMessage variant="sent">
                                                                Hello, how has your day been? I hope you are doing well.
                                                            </ChatBubbleMessage>
                                                        </ChatBubble>
                                                    </div>
                                                    <div className="flex justify-start">
                                                        <ChatBubble variant="received">
                                                            <ChatBubbleAvatar fallback="AI" />
                                                            <ChatBubbleMessage isLoading />
                                                        </ChatBubble>
                                                    </div>
                                                </div>
                                                <Card className="mt-3">
                                                    <CardContent>{JSON.stringify(state.chat)}</CardContent>
                                                </Card>
                                            </ScrollArea>
                                        </CardContent>
                                        <CardFooter className="flex items-center">
                                            <ChatInput
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type your question here..."
                                                className="min-h-12 resize-none rounded-lg p-3 ring-current flex-1 mr-3"
                                            />
                                            <Button
                                                className="ml-auto gap-1.5"
                                                onClick={handleSendMessage}
                                            >
                                                Send Message
                                                <CornerDownLeft />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </>
                        )
                }
            </Tabs>
        </>
    );
};

export default Visualization;
