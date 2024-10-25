"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import Sidebar from "./Sidebar";
import { useEffect, useReducer } from "react";
import { data, SelectOption } from "@/utils/data";
import Interface from "./Interface";

export interface Tag {
    display_name: string;
}

interface Datasets {
    state: string;
    title: string;
    notes: string;
    tags: Tag[];
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
    sortBy: string;
    searchQuery: string;
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
        sortBy: "relevance",
        searchQuery: "",
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

    const axiosHandler = async () => dispatch({ type: "filters", payload: await data.getFilters() });

    const updateFilters = async () => {
        const DATA = await data.getDataset(state.organization, state.groups, state.tags);
        dispatch({ type: "filters", payload: DATA.filters });
        dispatch({ type: "datasets", payload: DATA.results });
        dispatch({ type: "isLoadingFilters", payload: false });
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
