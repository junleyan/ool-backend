import * as React from "react";
import { State } from "@/app/page";
import { House, Paintbrush } from "lucide-react";
import { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { data } from "@/utils/data";

interface VisualizeToolbarProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const VisualizeToolbar = ({ state, dispatch }: VisualizeToolbarProps) => {

    const fetchChatQuestions = async () => {
        if (state.selectedDataset) {
            const DATA = await data.getChatQuestions(state.selectedDataset.name);
            dispatch({ type: "chatQuestions", payload: DATA });
        }
    }

    const handleReset = () => {
        dispatch({ type: "chat", payload: [] });
        fetchChatQuestions();
    }

    return (
        <>
            <div className="relative ml-auto">
                <Button variant="outline" className="flex items-center" onClick={() => dispatch({ type: "stage", payload: 'select' })}>
                    <House className="h-4 w-4" />
                </Button>
            </div>
            {
                state.subStage === 'chat' &&
                <Button disabled={state.isLoadingChat} variant="outline" className="flex items-center" onClick={handleReset}>
                    <Paintbrush className="h-4 w-4" />
                    Reset
                </Button>
            }
        </>
    );
};

export default VisualizeToolbar;
