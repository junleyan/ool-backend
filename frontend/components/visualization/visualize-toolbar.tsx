import * as React from "react";
import { State } from "@/app/page";
import { CircleHelp, House, Paintbrush } from "lucide-react";
import { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { data } from "@/utils/data";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

    const handleHelpClick = () => {
        help();
    }

    const help = () => {
        let toastDescription = "";
        switch(state.stage) {
            case "select":
                toastDescription = (state.organization || state.groups || state.tags || state.datasetSearchQuery)
                    ? "Select a dataset to view its information, tags, and formats."
                    : "Use the search bar, filtering, and sorting options to find a dataset.";
                break;
                case "visualize":
                    switch(state.subStage) {
                        case "info":
                            toastDescription = "Explore detailed information about the dataset, and view different download options";
                            break;
                        case "table":
                            toastDescription = "Click on column headers to sort data, or click on 'View' to toggle columns";
                            break;
                        case "graph":
                            toastDescription = "Use the settings to customize the chart. Click the download button to save the chart as an image.";
                            break;
                        case "chat":
                            toastDescription = "Interact with the dataset through chat. Ask questions to get data-derived insights.";
                            break;
                    }
                break;
        }

        toast("Tip:", {
            description: (
                <>
                    <p>{toastDescription}</p>
                </>
            ),
            duration: 5000,
            action: {
                label: 'X',
                onClick: (e) => {
                    e.preventDefault();
                    toast.dismiss();
                },
            },
        });
    }

    return (
        <>
            <div className="relative ml-auto">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" className="flex items-center" onClick={() => dispatch({ type: "stage", payload: 'select' })}>
                            <House className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Return to Selection
                    </TooltipContent>
                </Tooltip>

            </div>
            {
                state.subStage === 'chat' &&
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button disabled={state.isLoadingChat} variant="outline" className="flex items-center" onClick={handleReset}>
                            <Paintbrush className="h-4 w-4" />
                            Reset
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Reset Chat
                    </TooltipContent>
                </Tooltip>

            }
            
            {/* Help Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="flex items-center mr-4" onClick={handleHelpClick}>
                        <CircleHelp className="h-5 w-5"/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Help
                </TooltipContent>
            </Tooltip>
        </>
    );
};

export default VisualizeToolbar;
