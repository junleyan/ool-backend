import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Dispatch, FC } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { State } from "./App";

interface ComboboxProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const TagMultiSelectCombobox: FC<ComboboxProps> = ({ state, dispatch }) => {

    const handleSelect = (currentValue: string) => {
        const isSelected = state.tags.includes(currentValue);
        let newSelected;
        if (isSelected) {
            newSelected = state.tags.filter((value: string) => value !== currentValue);
        } else {
            newSelected = [...state.tags, currentValue];
        }
        dispatch({ type: "tags", payload: newSelected });
    };

    const handleRemoveTag = (value: string) => {
        const newSelected = state.tags.filter((tag: string) => tag !== value);
        dispatch({ type: "tags", payload: newSelected });
    };

    const handleClearAll = () => {
        dispatch({ type: "tags", payload: [] });
    };

    return (
        <>
            <p className="text-sm font-bold text-gray-800 mt-3 mb-1 ml-1">
                Tags
            </p>

            {/* Dropdown to select tags */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="tag-select"
                        variant="outline"
                        role="combobox"
                        className="w-60 justify-between border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 truncate"
                        disabled={state?.filters?.tags.length === 0}
                    >
                        <span>{state.tags.length > 0 ? "Edit tags..." : "Select tags..."}</span>
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0 border border-gray-300 rounded-md shadow-lg">
                    <Command>
                        <CommandInput placeholder="Search tags..." className="h-8 px-3 my-2 border-b border-gray-300" />
                        <CommandList>
                            <CommandEmpty>No tags found. Please try a different keyword.</CommandEmpty>
                            <CommandGroup>
                                {state?.filters?.tags.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        {option.label}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                state.tags.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-600 mt-1 ml-1">
                Filter datasets by selecting tags.
            </p>
            {
                state.tags.length > 0 && (
                    <p className="text-xs text-blue-500 mb-1 ml-1">
                        <a href="#" onClick={handleClearAll}>Clear filters</a>
                    </p>
                )
            }

            {/* Display selected tags as badges with a maximum height and scrollable area */}
            <ScrollArea className="max-h-30 overflow-y-auto"> {/* Set max height and enable vertical scrolling */}
                <div className="flex flex-wrap items-center gap-1 mb-2 mt-2">
                    {state.tags.length > 0 && (
                        state.tags.map((value: string) => {
                            const option = state?.filters?.tags.find((option) => option.value === value);
                            return option ? (
                                <Badge key={option.value} variant="secondary" className="flex items-center truncate">
                                    {option.label}
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="ml-1 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTag(option.value);
                                        }}
                                    >
                                        <Cross2Icon className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ) : null;
                        })
                    )}
                </div>
            </ScrollArea>
        </>
    );
};

export default TagMultiSelectCombobox;
