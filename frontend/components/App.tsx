"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import Sidebar from "./Sidebar";
import { useEffect, useReducer } from "react";
import { data } from "@/utils/data";

export interface SelectOption {
    label: string;
    value: string;
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
    };

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        axiosHandler();
    }, []);

    const axiosHandler = async () => dispatch({ type: "filters", payload: await data.getFilters() });

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
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default App;
