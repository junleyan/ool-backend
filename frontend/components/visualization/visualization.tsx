import { Dispatch, FC, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { State } from "@/app/page";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown, SlidersHorizontal, CornerDownLeft, MessageSquareText, Sheet } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";
import Graph from "./graph";
import { data } from "@/utils/data";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { ChatInput } from "../ui/chat/chat-input";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface VisualizationProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Visualization: FC<VisualizationProps> = ({ state, dispatch }) => {
    const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({});
    const [activeTab, setActiveTab] = useState<string>("table");
    const [message, setMessage] = useState("");
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVisibleColumns(Object.keys(state.csv[0] || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [state.csv]);

    useEffect(() => {
        if (!state.graphSetting && activeTab === "graph") {
            fetchGraphSetting();
        }
        dispatch({ type: "subStage", payload: activeTab });
    }, [activeTab]);

    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollIntoView(false);
        }
    }, [state.isLoadingChat, state.chat]);

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
        if (state.chat.length < 20) {
            if (message.trim()) {
                dispatch({ type: "chat", payload: [...state.chat, { type: "user", content: message }] });
                dispatch({ type: "isLoadingChat", payload: true });
                setMessage("");
            }
        }
        else {
            toast('You have reached the chat limit!', {
                description: (
                    "Reset to start a new conversation?"
                ),
                action: {
                    label: "Reset",
                    onClick: () => {
                        dispatch({ type: "chat", payload: [] });
                        toast("Reset done!");
                    }
                }
            })
        }
    };

    return (
        <>
            <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="my-4 mx-5">
                <TabsList>
                    <TabsTrigger value="table">Data Table</TabsTrigger>
                    <TabsTrigger disabled={state.isLoadingCSV} value="graph">Chart</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
                {
                    state.isLoadingCSV ?
                        (
                            <>
                                <TabsContent value="table">
                                    {Array.from({ length: 9 }).map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="aspect-video h-12 mt-4 w-full rounded-lg bg-muted/50"
                                        />
                                    ))}
                                </TabsContent>
                                <TabsContent value="graph">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="aspect-video h-20 mt-4 w-full rounded-lg bg-muted/50"
                                        />
                                    ))}
                                </TabsContent>
                                <TabsContent value="chat">
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="aspect-video h-14 mt-4 w-full rounded-lg bg-muted/50"
                                        />
                                    ))}
                                </TabsContent>
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
                                                    <Card className="w-full mt-5 flex flex-col items-center justify-center text-center">
                                                        <CardTitle className="m-5">Unfortunately, this dataset can't be graphed</CardTitle>
                                                        <CardContent className="flex items-center space-x-3">
                                                            <Button
                                                                disabled={state.isLoadingChat}
                                                                variant="outline"
                                                                className="flex items-center justify-center"
                                                                onClick={() => setActiveTab('table')}
                                                            >
                                                                <Sheet className="h-4 w-4 mr-2" />
                                                                Go to Data Table
                                                            </Button>
                                                            <Button
                                                                disabled={state.isLoadingChat}
                                                                variant="outline"
                                                                className="flex items-center justify-center"
                                                                onClick={() => setActiveTab('chat')}
                                                            >
                                                                <MessageSquareText className="h-4 w-4 mr-2" />
                                                                Go to Chat
                                                            </Button>
                                                        </CardContent>
                                                    </Card>


                                            )
                                            :
                                            <>
                                                {Array.from({ length: 6 }).map((_, index) => (
                                                    <Skeleton
                                                        key={index}
                                                        className="aspect-video h-20 mt-4 w-full rounded-lg bg-muted/50"
                                                    />
                                                ))}
                                            </>
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
                                                <ScrollAreaViewport>
                                                    <div className="flex flex-col flex-grow space-y-3" ref={viewportRef}>
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
                                                        {
                                                            state.isLoadingChat &&
                                                            <div className="flex justify-start">
                                                                <ChatBubble variant="received">
                                                                    <ChatBubbleAvatar fallback="AI" />
                                                                    <ChatBubbleMessage isLoading />
                                                                </ChatBubble>
                                                            </div>
                                                        }
                                                    </div>
                                                </ScrollAreaViewport>
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
                                                disabled={state.isLoadingChat || message.trim().length === 0}
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
