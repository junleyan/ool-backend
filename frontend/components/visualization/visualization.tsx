import { Dispatch, FC, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { State } from "@/app/page";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown, SlidersHorizontal, CornerDownLeft, MessageSquareText, Sheet, Download, ExternalLink } from "lucide-react";
import { UserRound, UserRoundPen, Scale, Building, UsersRound, Tags, Calendar, CalendarClock } from "lucide-react";
import { FileText, FileJson, FileCode, FolderArchive, FileArchive, Server, Earth, FileVideo, Map } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";
import Graph from "./graph";
import { data } from "@/utils/data";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { ChatInput } from "../ui/chat/chat-input";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { getFormatColor } from "@/utils/convert";
import ReactMarkdown from "react-markdown";


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

    const resourceTypes: { [key: string]: string[] } = {
        "download": ["CSV", "GeoJSON", "ZIP", "KML", "JSON", "RDF", "XLSX", "KMZ", "XLS", "PDF"],
        "web": ["HTML", "ArcGIS GeoServices REST API", "XML", "OGC WFS", "OGC WMS", "PDF", "MP4"]
    }

    const resourceIcons: { [key: string]: JSX.Element } = {
        "CSV": <FileText className="h-5 w-5" color={getFormatColor("CSV")} />,
        "GeoJSON": <FileJson className="h-5 w-5" color={getFormatColor("GeoJSON")} />,
        "ZIP": <FolderArchive className="h-5 w-5" color={getFormatColor("ZIP")} />,
        "KML": <Earth className="h-5 w-5" color={getFormatColor("KML")} />,
        "JSON": <FileJson className="h-5 w-5" color={getFormatColor("JSON")} />,
        "RDF": <FileCode className="h-5 w-5" color={getFormatColor("RDF")} />,
        "XLSX": <FileArchive className="h-5 w-5" color={getFormatColor("XLSX")} />,
        "KMZ": <FolderArchive className="h-5 w-5" color={getFormatColor("KMZ")} />,
        "XLS": <FileArchive className="h-5 w-5" color={getFormatColor("XLS")} />,
        "PDF": <FileText className="h-5 w-5" color={getFormatColor("PDF")} />,
        "HTML": <FileCode className="h-5 w-5" color={getFormatColor("HTML")} />,
        "ArcGIS GeoServices REST API": <Server className="h-5 w-5" color={getFormatColor("ArcGIS GeoServices REST API")} />,
        "XML": <FileCode className="h-5 w-5" color={getFormatColor("XML")} />,
        "OGC WFS": <Map className="h-5 w-5" color={getFormatColor("OGC WFS")} />,
        "OGC WMS": <Map className="h-5 w-5" color={getFormatColor("OGC WMS")} />,
        "MP4": <FileVideo className="h-5 w-5" color={getFormatColor("MP4")} />
    }

    useEffect(() => {
        setVisibleColumns(Object.keys(state.csv[0] || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [state.csv]);

    useEffect(() => {
        if (!state.graphSetting && activeTab === "graph") {
            fetchGraphSetting();
        }
        if (state.chatQuestions.length === 0 && activeTab === "chat") {
            fetchChatQuestions();
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

    const fetchChatQuestions = async () => {
        if (state.selectedDataset) {
            const DATA = await data.getChatQuestions(state.selectedDataset.name);
            dispatch({ type: "chatQuestions", payload: DATA });
        }
    }

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

    const handleSendMessage = (index: number | null) => {
        if (index !== null) {
            dispatch({ type: "chat", payload: [...state.chat, { type: "user", content: state.chatQuestions[index] }] });
            dispatch({ type: "isLoadingChat", payload: true });
        }
        else {
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
        }
    };

    return (
        <>
            <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="my-4 mx-5">
                <TabsList>
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="table">Data Table</TabsTrigger>
                    <TabsTrigger disabled={state.isLoadingCSV} value="graph">Chart</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
                {
                    state.isLoadingCSV ?
                        (
                            <>
                                <TabsContent value="info">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="aspect-video h-12 mt-4 w-full rounded-lg bg-muted/50"
                                        />
                                    ))}
                                </TabsContent>                            
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
                                <TabsContent value="info">
                                    <Card className="mt-4 grid">
                                        <CardHeader>
                                            <CardTitle className="break-words">{state.selectedDataset?.title}</CardTitle>
                                            <CardDescription className="mt-4 w-full lg:w-3/5 break-words">
                                                <div dangerouslySetInnerHTML={{ __html: state.selectedDataset?.notes || "" }} className="break-words" />
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Table className="mb-4 lg:mb-1">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <UserRound className="h-5 w-5" />
                                                            <span>Author:</span>
                                                        </TableCell>
                                                        <TableCell>{state.selectedDataset?.author || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <UserRoundPen className="h-5 w-5" />
                                                            <span>Maintainer:</span>
                                                        </TableCell>
                                                        <TableCell>{state.selectedDataset?.maintainer || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <Scale className="h-5 w-5" />
                                                            <span>License:</span>
                                                        </TableCell>
                                                        <TableCell>{state.selectedDataset?.license_id || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <Building className="h-5 w-5" />
                                                            <span>Organization:</span>
                                                        </TableCell>
                                                        <TableCell>{state.selectedDataset?.organization.title || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <UsersRound className="h-5 w-5" />
                                                            <span>Group:</span>
                                                        </TableCell>
                                                        <TableCell>{state.selectedDataset?.groups?.[0]?.title || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <Tags className="h-5 w-5" />
                                                            <span>Tags:</span>
                                                        </TableCell>
                                                        <TableCell>{state.selectedDataset?.tags.map(tag => tag.display_name).join(', ') || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <Calendar className="h-5 w-5" />
                                                            <span>Created Date:</span>
                                                        </TableCell>
                                                        <TableCell>{new Date(state.selectedDataset?.metadata_created || "").toLocaleDateString() || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border-r font-bold flex items-center space-x-2">
                                                            <CalendarClock className="h-5 w-5" />
                                                            <span>Last Modified Date:</span>
                                                        </TableCell>
                                                        <TableCell>{new Date(state.selectedDataset?.metadata_modified || "").toLocaleDateString() || "N/A"}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <Table>
                                                <TableHeader className="mt-1">
                                                    <TableRow>
                                                        <TableHead className="border-r font-bold">Data</TableHead>
                                                        <TableHead className="font-bold">Resources</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {state.selectedDataset?.resources
                                                        .filter((resource) => resource.format.length > 0)
                                                        .map((resource, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell className="border-r font-bold flex items-center space-x-2">
                                                                    {resourceIcons[resource.format]}
                                                                    <span>{resource.format}</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <a
                                                                        href={resource.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        title={
                                                                            resourceTypes.download.includes(resource.format)
                                                                                ? "Download " + resource.format
                                                                                : "View " + resource.format
                                                                        }
                                                                    >
                                                                        {resourceTypes.download.includes(resource.format) ? (
                                                                            <span className="flex items-center space-x-2">
                                                                                <span>Download</span>
                                                                                <Download className="h-4 w-4" />
                                                                            </span>
                                                                        ) : (
                                                                            <span className="flex items-center space-x-2">
                                                                                <span>Open</span>
                                                                                <ExternalLink className="h-4 w-4" />
                                                                            </span>
                                                                        )}
                                                                    </a>
                                                                </TableCell>
                                                            </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
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
                                                        <CardTitle className="m-5">Unfortunately, this dataset can&apos;t be graphed</CardTitle>
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
                                                            state.chatQuestions.length > 0 && state.chat.length === 0 &&
                                                            <ChatBubble variant="received">
                                                                <ChatBubbleAvatar fallback="AI" />
                                                                <ChatBubbleMessage variant="received" className="flex flex-col">
                                                                    <b>Here are some suggestion questions you can ask</b>
                                                                    {
                                                                        state.chatQuestions.map((question, index) => {
                                                                            return (
                                                                                <div key={index} className="flex items-center space-x-2"> {/* Updated line */}
                                                                                    <span>
                                                                                        -{" "}
                                                                                        <u onClick={() => handleSendMessage(index)} className="cursor-pointer">
                                                                                            {question}
                                                                                        </u>
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </ChatBubbleMessage>
                                                            </ChatBubble>
                                                        }

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
                                                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
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
                                                onClick={() => handleSendMessage(null)}
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
