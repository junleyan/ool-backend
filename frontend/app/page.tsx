'use client';

import AppSidebar from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useReducer } from "react";
import { data } from "../utils/data";
import Datasets from "@/components/dataset";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface State {
    filters: {
        organizations: SelectOption[];
        groups: SelectOption[];
        tags: SelectOption[];
        licenses: SelectOption[];
        formats: SelectOption[];
    };
    datasets: {
        state: string;
        name: string;
        title: string;
        notes: string;
        tags: Tag[];
        resources: Resource[];
    }[];
    organization: string | null;
    groups: string[];
    tags: string[];
    isLoadingFilters: boolean;
    isLoadingDatasets: boolean;
    stage: string;
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
    format: string;
    state: string;
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
        isLoadingFilters: true,
        isLoadingDatasets: true,
        stage: 'select'
    }

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        axiosHandler();
    }, []);

    useEffect(() => {
        if (state.isLoadingFilters) {
            updateFilters();
        }
    }, [state.isLoadingFilters]);

    useEffect(() => {
        if (!state.isLoadingFilters) {
            dispatch({ type: "isLoadingFilters", payload: true });
        }
        if (!state.isLoadingDatasets) {
            dispatch({ type: "isLoadingDatasets", payload: true });
        }
    }, [state.organization, state.groups, state.tags]);

    const axiosHandler = async () => {
        const DATA = await data.getFilters();
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
        dispatch({ type: "isLoadingFilters", payload: false });
        dispatch({ type: "isLoadingDatasets", payload: false });
    };

    const updateFilters = async () => {
        const DATA = await data.getDataset(state.organization, state.groups, state.tags);
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
        dispatch({ type: "isLoadingFilters", payload: false });
        dispatch({ type: "isLoadingDatasets", payload: false });
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
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Select Your Dataset
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Visualization</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="relative ml-auto mr-3.5">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search" className="pl-8" />
                    </div>
                </header>
                <main>
                    {
                        state.isLoadingDatasets ?
                            <div className="flex flex-1 flex-col gap-4">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="aspect-video h-12 w-full rounded-lg bg-muted/50"
                                    />
                                ))}
                            </div>
                            :
                            <Datasets state={state} dispatch={dispatch} />
                    }
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
