'use client';

import AppSidebar from "@/components/sidebar/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useReducer } from "react";
import { data } from "../utils/data";
import { Skeleton } from "@/components/ui/skeleton";
import DatasetToolbar from "@/components/datasets/dataset-toolbar";
import Datasets from "@/components/datasets/datasets";
import Visualization from "@/components/visualization/visualization";
import { toast } from "sonner";
import VisualizeToolbar from "@/components/visualization/visualize-toolbar";

export interface State {
    filters: {
        organizations: SelectOption[];
        groups: SelectOption[];
        tags: SelectOption[];
        licenses: SelectOption[];
        formats: SelectOption[];
    };
    datasets: Dataset[];
    organization: string | null;
    groups: string[];
    tags: string[];
    recentDatasets: Dataset[];
    isLoadingFilters: boolean;
    isLoadingDatasets: boolean;
    isLoadingCSV: boolean;
    stage: string;
    subStage: string;
    datasetSearchQuery: string;
    datasetSort: string;
    datasetShowTags: boolean;
    datasetShowFormats: boolean;
    datasetShowBookmarkOnly: boolean;
    selectedDataset: Dataset | null;
    csv: CSV[];
    graphSetting: GraphSetting | null;
    chat: Chat[];
    isLoadingChat: boolean;
    chatQuestions: string[];
    isLoadingAISuggestions: boolean;
    allDatasets: Dataset[];
    displayAISuggestions: boolean;
}

export interface Dataset {
    state: string;
    name: string;
    title: string;
    notes: string;
    metadata_created: string;
    metadata_modified: string;
    author: string;
    maintainer: string;
    license_id: string;
    organization: {
        id: string;
        name: string;
        title: string;
        type: string;
        description: string;
        image_url: string;
        created: string;
        is_organization: boolean;
        approval_status: string;
        state: string;
    };
    groups: Group[];
    tags: Tag[];
    resources: Resource[];
}

export interface Group {
    description: string;
    display_name: string;
    id: string;
    image_display_url: string;
    name: string;
    title: string;
}

export interface SelectOption {
    label: string;
    value: string;
    count: number;
}

export interface Tag {
    display_name: string;
}

export interface Resource {
    last_modified: string | number | Date;
    url: string;
    format: string;
    state: string;
}

export interface CSV {
    [key: string]: string;
}

export interface Chat {
    type: string
    content: string
}

export interface GraphSetting {
    title: string
    subtitle: string
    x: string
    y: string[]
    graphable: boolean
}

function reducer(state: State, action: { type: string; payload: unknown }): State {
    if (action.type in state) {
        return {
            ...state,
            [action.type]: action.payload,
        };
    }
    return state;
}

export default function Home() {

    const INITIAL_STATE = {
        filters: {
            organizations: [],
            groups: [],
            tags: [],
            licenses: [],
            formats: []
        },
        datasets: [],
        organization: null,
        groups: [],
        tags: [],
        recentDatasets: [],
        isLoadingFilters: true,
        isLoadingDatasets: true,
        isLoadingCSV: true,
        stage: 'select',
        subStage: 'table',
        datasetSearchQuery: '',
        datasetSort: 'time descending',
        datasetShowTags: true,
        datasetShowFormats: true,
        datasetShowBookmarkOnly: false,
        selectedDataset: null,
        csv: [],
        graphSetting: null,
        chat: [],
        isLoadingChat: false,
        chatQuestions: [],
        isLoadingAISuggestions: false,
        allDatasets: [],
        displayAISuggestions: false
    }

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        axiosHandler();
        if (localStorage.getItem("recent-dataset")) {
            dispatch({ type: "recentDatasets", payload: JSON.parse(localStorage.getItem("recent-dataset") || "[]") });
        }
        if (!localStorage.getItem("persona")) {
            localStorage.setItem("persona", "A Hawaii resident");
        }
    }, []);

    useEffect(() => {
        if (!state.displayAISuggestions && state.datasets.length > 0) {
            dispatch({ type: "isLoadingFilters", payload: true });
        }
    }, [state.displayAISuggestions]);

    useEffect(() => {
        if (state.isLoadingFilters) {
            updateFilters();
        }
    }, [state.isLoadingFilters]);

    useEffect(() => {
        if (state.isLoadingAISuggestions) {
            fetchAISuggestion();
        }
    }, [state.isLoadingAISuggestions]);

    useEffect(() => {
        if (!state.isLoadingFilters) {
            dispatch({ type: "isLoadingFilters", payload: true });
        }
        if (!state.isLoadingDatasets) {
            dispatch({ type: "isLoadingDatasets", payload: true });
        }
        dispatch({ type: "stage", payload: 'select' });
    }, [state.organization, state.groups, state.tags]);

    useEffect(() => {
        if (state.selectedDataset) {
            dispatch({ type: "isLoadingCSV", payload: true });
            updateCSV(state.selectedDataset.name);
            fetchPersona();
        }
    }, [state.selectedDataset]);

    useEffect(() => {
        if (state.isLoadingChat) {
            fetchChatResponse();
        }
    }, [state.isLoadingChat]);

    const axiosHandler = async () => {
        const DATA = await data.getFilters();
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
        dispatch({ type: "allDatasets", payload: [...DATA.results] });
        dispatch({ type: "isLoadingFilters", payload: false });
        dispatch({ type: "isLoadingDatasets", payload: false });
    };

    const updateFilters = async () => {
        const DATA = await data.getDataset(state.organization, state.groups, state.tags);
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
        dispatch({ type: "isLoadingFilters", payload: false });
        dispatch({ type: "isLoadingDatasets", payload: false });
        dispatch({ type: "graphSetting", payload: null });
    }

    const updateCSV = async (name: string) => {
        const DATA = await data.getCSV(name);
        dispatch({ type: "csv", payload: DATA });
        dispatch({ type: "isLoadingCSV", payload: false });
        dispatch({ type: "graphSetting", payload: null });
        dispatch({ type: "chat", payload: [] });
        dispatch({ type: "chatQuestions", payload: [] });
    }

    const handleStageChange = (stage: string) => {
        dispatch({ type: "stage", payload: stage });
    }

    const handleClearAllFilters = () => {
        dispatch({ type: "organization", payload: null });
        dispatch({ type: "groups", payload: [] });
        dispatch({ type: "tags", payload: [] });
    }

    const fetchChatResponse = async () => {
        if (state.selectedDataset) {
            const DATA = await data.getChatResponse(state.selectedDataset.name, state.chat);
            if (DATA === 'failed') {
                toast("Failed to fetch response")
                const PREV_CHAT = [...state.chat];
                PREV_CHAT.pop();
                dispatch({ type: "isLoadingChat", payload: false });
                dispatch({ type: "chat", payload: PREV_CHAT });
            }
            else {
                const PREV_CHAT = [...state.chat];
                PREV_CHAT.push({ type: 'assistant', content: DATA })
                dispatch({ type: "chat", payload: PREV_CHAT });
                dispatch({ type: "isLoadingChat", payload: false });
            }
        }
    }

    const fetchPersona = async () => {
        if (state.selectedDataset) {
            if (localStorage.getItem('persona')) {
                const DATA = await data.getPersona(localStorage.getItem('persona') || 'A Hawaii resident', state.selectedDataset.name);
                localStorage.setItem('persona', DATA);
            }
        }
    }

    const fetchAISuggestion = async () => {
        if (localStorage.getItem('persona')) {
            const DATA = await data.getAISuggestions(localStorage.getItem('persona') || 'A Hawaii resident');
            const DATASETS = state.allDatasets.filter(dataset => DATA.includes(dataset.name));
            dispatch({ type: "datasets", payload: DATASETS });
            dispatch({ type: "isLoadingAISuggestions", payload: false });
            dispatch({ type: "displayAISuggestions", payload: true });
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar state={state} dispatch={dispatch} />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className={`hidden cursor-pointer ${state.stage !== 'select' ? 'opacity-50' : 'opacity-100'} md:block`}>
                                <BreadcrumbLink onClick={() => handleStageChange('select')}>
                                    Select Your Dataset
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {
                                state.selectedDataset &&
                                <>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem className={`cursor-pointer ${state.stage !== 'visualize' ? 'opacity-50' : 'opacity-100'}`}>
                                        <BreadcrumbLink onClick={() => handleStageChange('visualize')}>
                                            Analyze
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            }
                        </BreadcrumbList>
                    </Breadcrumb>
                    {
                        state.stage === 'select' &&
                        <DatasetToolbar state={state} dispatch={dispatch} />
                    }
                    {
                        state.stage === 'visualize' &&
                        <VisualizeToolbar state={state} dispatch={dispatch} />
                    }
                </header>
                <main>
                    {
                        state.isLoadingDatasets || state.isLoadingFilters || state.isLoadingAISuggestions ?
                            <div className="flex flex-1 flex-col gap-4 mx-4 mt-4">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="aspect-video h-12 w-full rounded-lg bg-muted/50"
                                    />
                                ))}
                            </div>
                            :
                            <>
                                {
                                    state.stage === 'select' ?
                                        <Datasets state={state} dispatch={dispatch} />
                                        :
                                        <Visualization state={state} dispatch={dispatch} />
                                }
                            </>
                    }
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
