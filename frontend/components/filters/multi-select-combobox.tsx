import { CheckIcon, ChevronsUpDown, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { FC, useState } from "react"

interface MultiSelectComboboxProps {
    items: { value: string; label: string }[]
    selectedValues: string[]
    name: string
    placeholder: string
    onSelect: (values: string[]) => void
    disabled: boolean
    clear: () => void
}

const MultiSelectCombobox: FC<MultiSelectComboboxProps> = ({ items, selectedValues, name, placeholder, onSelect, disabled, clear }) => {
    const [open, setOpen] = useState(false)

    const handleSelect = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value]
        onSelect(newValues)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-[200px] justify-between"
                >
                    <span className="truncate max-w-[150px] overflow-hidden text-ellipsis">
                        {selectedValues.length > 0
                            ? `${selectedValues.length} selected`
                            : placeholder}
                    </span>
                    {selectedValues.length > 0 ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                clear();
                            }}
                            className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                        >
                            <X />
                        </div>
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </Button>

            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No {name} found.</CommandEmpty>
                        <CommandGroup>
                            {items.map(item => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => handleSelect(item.value)}
                                >
                                    {item.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedValues.includes(item.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default MultiSelectCombobox
