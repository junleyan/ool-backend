import * as React from "react";
import { State } from "@/app/page";
import { Search, CalendarArrowUp, CalendarArrowDown, AArrowUp, AArrowDown, Check, SpellCheck, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

interface DatasetToolbarProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const DatasetToolbar = ({ state, dispatch }: DatasetToolbarProps) => {
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value;
        dispatch({ type: "datasetSearchQuery", payload: searchQuery });
        dispatch({ type: "isLoadingDatasets", payload: true });

        setTimeout(() => {
            dispatch({ type: "isLoadingDatasets", payload: false });
        }, 750);
    };

    const handleSortChange = (value: string) => {
        dispatch({ type: "datasetSort", payload: value });
    };

    const toggleShowTags = () => {
        dispatch({ type: "datasetShowTags", payload: !state.datasetShowTags });
    };

    const toggleShowFormats = () => {
        dispatch({ type: "datasetShowFormats", payload: !state.datasetShowFormats });
    };

    const renderSortIcon = () => {
        switch (state.datasetSort) {
            case "time ascending":
                return <CalendarArrowUp />;
            case "time descending":
                return <CalendarArrowDown />;
            case "alphabetical ascending":
                return <AArrowUp />;
            case "alphabetical descending":
                return <AArrowDown />;
            case "relevance":
            default:
                return <SpellCheck />;
        }
    };

    return (
        <>
            <div className="relative ml-auto">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search"
                    className="pl-8"
                    value={state.datasetSearchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                        {renderSortIcon()}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSortChange("relevance")} className="flex items-center space-x-2">
                        {state.datasetSort === "relevance" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                        <span>Relevance</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("alphabetical ascending")} className="flex items-center space-x-2">
                        {state.datasetSort === "alphabetical ascending" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                        <span>Alphabetical Ascending</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("alphabetical descending")} className="flex items-center space-x-2">
                        {state.datasetSort === "alphabetical descending" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                        <span>Alphabetical Descending</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("time ascending")} className="flex items-center space-x-2">
                        {state.datasetSort === "time ascending" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                        <span>Time Ascending</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("time descending")} className="flex items-center space-x-2">
                        {state.datasetSort === "time descending" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                        <span>Time Descending</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* New Dropdown for Toggle Options */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center mr-4">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="ml-1">View</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel>Toggle View</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={state.datasetShowTags} onCheckedChange={toggleShowTags}>
                        Show Tags
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={state.datasetShowFormats} onCheckedChange={toggleShowFormats}>
                        Show Formats
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default DatasetToolbar;
