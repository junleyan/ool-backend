"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import Sidebar from "./Sidebar";
import { useEffect, useReducer } from "react";
import { data, SelectOption } from "@/utils/data";
import Interface from "./Interface";

export interface Tag {
    display_name: string;
}

export interface Resource {
    format: string;
    state: string;
}

interface Datasets {
    state: string;
    name: string;
    title: string;
    notes: string;
    tags: Tag[];
    resources: Resource[];
}

export interface State {
    [key: string]: unknown;
    filters: {
        organizations: SelectOption[];
        groups: SelectOption[];
        tags: SelectOption[];
        licenses: SelectOption[];
        formats: SelectOption[];
    };
    organization: string | null;
    groups: string[];
    tags: string[];
    datasets: Datasets[];
    csv: {[key: string]: string}[];
    sortBy: string;
    searchQuery: string;
    selectedDataset: {
        name: string | null,
        title: string | null
    };
    showTags: boolean;
    showFormats: boolean;
    visualize: boolean;
    isLoadingFilters: boolean;
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

const App = () => {

    const INITIAL_STATE: State = {
        filters: {
            organizations: [],
            groups: [],
            tags: [],
            licenses: [],
            formats: []
        },
        organization: null,
        groups: [],
        tags: [],
        datasets: [],
        csv: [],
        sortBy: "relevance",
        searchQuery: "",
        selectedDataset: {
            name: null,
            title: null
        },
        showTags: true,
        showFormats: true,
        visualize: false,
        isLoadingFilters: false
    };

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        axiosHandler();
    }, []);

    useEffect(() => {
        if (state.isLoadingFilters) {
            updateFilters();
        }
    }, [state.isLoadingFilters])

    useEffect(() => {
        if (state.selectedDataset.name) {
            fetchCSV(state.selectedDataset.name);
        }
    }, [state.selectedDataset.name])

    const axiosHandler = async () => {
        const DATA = await data.getFilters();
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
    };

    const updateFilters = async () => {
        const DATA = await data.getDataset(state.organization, state.groups, state.tags);
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
        dispatch({ type: "isLoadingFilters", payload: false });
    }

    const fetchCSV = async ( name: string ) => {
        const DATA = await data.getCSV(name);
        dispatch({ type: "csv", payload: DATA });
    }

    return (
        <div className="w-screen h-screen">
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full h-full rounded-lg border"
            >
                <ResizablePanel defaultSize={25} maxSize={25} minSize={25}>
                    <Sidebar state={state} dispatch={dispatch} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={80}>
                    <Interface state={state} dispatch={dispatch} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default App;
