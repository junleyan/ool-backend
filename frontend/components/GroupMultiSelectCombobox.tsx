import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { data } from "@/utils/data";
import { Dispatch, FC, useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

interface OptionItem {
    value: string;
    label: string;
}

interface Options {
    groupOptions: OptionItem[];
}

interface ComboboxProps {
    state: unknown;
    dispatch: Dispatch<unknown>;
}

const GroupMultiSelectCombobox: FC<ComboboxProps> = ({ state, dispatch }) => {
    const [options, setOptions] = useState<Options>({
        groupOptions: [],
    });

    useEffect(() => {
        const axiosHandler = async () => {
            const GROUPS = await data.getGroupOptions();
            setOptions({
                groupOptions: GROUPS,
            });
        };
        axiosHandler();
    }, []);

    const handleSelect = (currentValue: string) => {
        const isSelected = state.groups.includes(currentValue);
        let newSelected;
        if (isSelected) {
            newSelected = state.groups.filter((value: string) => value !== currentValue);
        } else {
            newSelected = [...state.groups, currentValue];
        }
        dispatch({ type: "groups", payload: newSelected });
    };

    const handleRemoveGroup = (value: string) => {
        const newSelected = state.groups.filter((group: string) => group !== value);
        dispatch({ type: "groups", payload: newSelected });
    };

    return (
        <>
            <p className="text-sm font-bold text-gray-800 mt-3 mb-1 ml-1">
                Groups
            </p>

            {/* Dropdown to select groups */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="group-select"
                        variant="outline"
                        role="combobox"
                        className="w-60 justify-between border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 truncate"
                        disabled={options.groupOptions.length === 0}
                    >
                        <span>{state.groups.length > 0 ? "Edit groups..." : "Select groups..."}</span>
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0 border border-gray-300 rounded-md shadow-lg">
                    <Command>
                        <CommandInput placeholder="Search groups..." className="h-8 px-3 my-2 border-b border-gray-300" />
                        <CommandList>
                            <CommandEmpty>No groups found. Please try a different keyword.</CommandEmpty>
                            <CommandGroup>
                                {options.groupOptions.map((option) => (
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
                                                state.groups.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-600 mt-1 mb-2 ml-1">
                Filter datasets by selecting groups.
            </p>

            {/* Display selected groups as badges with a maximum height and scrollable area */}
            <ScrollArea className="max-h-32 overflow-y-auto"> {/* Set max height and enable vertical scrolling */}
                <div className="flex flex-wrap items-center gap-1 mb-2 mt-2">
                    {state.groups.length > 0 ? (
                        state.groups.map((value: string) => {
                            const option = options.groupOptions.find((option) => option.value === value);
                            return option ? (
                                <Badge key={option.value} variant="secondary" className="flex items-center truncate">
                                    {option.label}
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="ml-1 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveGroup(option.value);
                                        }}
                                    >
                                        <Cross2Icon className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ) : null;
                        })
                    ) : (
                        <span className="text-gray-500 text-sm ml-1">No groups selected</span>
                    )}
                </div>
            </ScrollArea>
        </>
    );
};

export default GroupMultiSelectCombobox;
