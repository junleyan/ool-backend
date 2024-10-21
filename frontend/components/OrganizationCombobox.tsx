import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dispatch, FC } from "react";
import { State } from "./App";

interface ComboboxProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const OrganizationCombobox: FC<ComboboxProps> = ({ state, dispatch }) => {

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === state.organization ? "" : currentValue;
        dispatch({ type: "organization", payload: newValue });
    };

    return (
        <>
            <p className="text-sm font-bold text-gray-800 mb-1 ml-1">
                Organization
            </p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="organization-select"
                        variant="outline"
                        role="combobox"
                        className="w-60 justify-between border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 truncate"
                        disabled={state?.filters?.organizations.length === 0}
                    >
                        {state.organization ? (
                            <span className='truncate'>{state?.filters?.organizations.find((option) => option.value === state.organization)?.label}</span>
                        ) : "Select organization..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0 border border-gray-300 rounded-md shadow-lg">
                    <Command>
                        <CommandInput placeholder="Search organization..." className="h-8 px-3 my-2 border-b border-gray-300" />
                        <CommandList>
                            <CommandEmpty>No organizations found. Please try a different keyword.</CommandEmpty>
                            <CommandGroup>
                                {state?.filters?.organizations.map((option) => (
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
                                                state.organization === option.value ? "opacity-100" : "opacity-0"
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
                Filter datasets by selecting a publishing organization.
            </p>
        </>
    );
};

export default OrganizationCombobox;
