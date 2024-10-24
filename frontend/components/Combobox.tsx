import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dispatch, FC } from "react";

interface ComboboxOption {
    value: string;
    label: string;
    count?: number;
}

interface ComboboxProps {
    label: string;
    placeholder: string;
    selectedValue: string | null;
    options?: ComboboxOption[];
    dispatch: Dispatch<{ type: string; payload: unknown }>;
    stateKey: string;
    emptyMessage?: string;
    isLoading: boolean
}

const Combobox: FC<ComboboxProps> = ({
    label,
    placeholder,
    selectedValue,
    options = [],
    dispatch,
    stateKey,
    emptyMessage = "No items found. Please try a different keyword.",
    isLoading
}) => {

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === selectedValue ? null : currentValue;
        dispatch({ type: stateKey, payload: newValue });
        dispatch({ type: 'isLoadingFilters', payload: true });
    };

    return (
        <>
            <p className="text-sm font-bold mb-1 ml-1">
                {label}
            </p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={`${stateKey}-select`}
                        variant="outline"
                        role="combobox"
                        className="w-60 justify-between border rounded-md shadow-sm truncate"
                        disabled={options.length === 0 || isLoading}
                    >
                        {selectedValue ? (
                            <span className='truncate'>
                                {options.find((option) => option.value === selectedValue)?.label}
                            </span>
                        ) : placeholder}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0 border rounded-md shadow-lg">
                    <Command>
                        <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-8 px-3 my-2 border-b border-gray-300" />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="px-3 py-2 flex justify-between items-center"
                                    >
                                        <span>{option.label}</span>
                                        {selectedValue === option.value ? (
                                            <CheckIcon className="ml-2 w-5 text-gray-900" />
                                        ) : option.count ? (
                                            <span className="ml-2 bg-gray-300 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                {option.count}
                                            </span>
                                        ) : null}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-600 mt-1 ml-1">
                Filter datasets by selecting a publishing {label.toLowerCase()}.
            </p>
        </>
    );
};

export default Combobox;
