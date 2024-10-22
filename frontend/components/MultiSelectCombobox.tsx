import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Dispatch, FC } from "react";
import { ScrollArea } from "./ui/scroll-area";

interface MultiSelectComboboxProps {
    label: string;
    selectedItems: string[];
    items: { label: string; value: string }[];
    dispatch: Dispatch<{ type: string; payload: unknown }>;
    stateKey: string; // Either 'groups', 'tags', or another key for selected items
}

const MultiSelectCombobox: FC<MultiSelectComboboxProps> = ({
    label,
    selectedItems,
    items,
    dispatch,
    stateKey,
}) => {
    const handleSelect = (currentValue: string) => {
        const isSelected = selectedItems.includes(currentValue);
        let newSelected;
        if (isSelected) {
            newSelected = selectedItems.filter((value: string) => value !== currentValue);
        } else {
            newSelected = [...selectedItems, currentValue];
        }
        dispatch({ type: stateKey, payload: newSelected });
    };

    const handleRemoveItem = (value: string) => {
        const newSelected = selectedItems.filter((item: string) => item !== value);
        dispatch({ type: stateKey, payload: newSelected });
    };

    const handleClearAll = () => {
        dispatch({ type: stateKey, payload: [] });
    };

    return (
        <>
            <p className="text-sm font-bold text-gray-800 mt-3 mb-1 ml-1">{label}</p>

            {/* Dropdown to select items */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-60 justify-between border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 truncate"
                        disabled={items.length === 0}
                    >
                        <span>{selectedItems.length > 0 ? `Edit ${label.toLowerCase()}...` : `Select ${label.toLowerCase()}...`}</span>
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0 border border-gray-300 rounded-md shadow-lg">
                    <Command>
                        <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-8 px-3 my-2 border-b border-gray-300" />
                        <CommandList>
                            <CommandEmpty>No {label.toLowerCase()} found. Please try a different keyword.</CommandEmpty>
                            <CommandGroup>
                                {items.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        {option.label}
                                        <CheckIcon
                                            className={cn("ml-auto h-4 w-4", selectedItems.includes(option.value) ? "opacity-100" : "opacity-0")}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-600 mt-1 ml-1">Filter datasets by selecting {label.toLowerCase()}.</p>
            {selectedItems.length > 0 && (
                <p className="text-xs text-blue-500 mb-1 ml-1">
                    <a href="#" onClick={handleClearAll}>Clear filters</a>
                </p>
            )}

            {/* Display selected items as badges with a maximum height and scrollable area */}
            <ScrollArea className="max-h-32 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-1 mb-2 mt-2">
                    {selectedItems.length > 0 &&
                        selectedItems.map((value: string) => {
                            const option = items.find((option) => option.value === value);
                            return option ? (
                                <Badge key={option.value} variant="secondary" className="flex items-center truncate">
                                    {option.label}
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="ml-1 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveItem(option.value);
                                        }}
                                    >
                                        <Cross2Icon className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ) : null;
                        })}
                </div>
            </ScrollArea>
        </>
    );
};

export default MultiSelectCombobox;
