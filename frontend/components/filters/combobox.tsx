import { CheckIcon, ChevronsUpDown, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Dispatch, FC, useState } from "react"

interface ComboboxProps {
    items: { value: string; label: string }[]
    selectedValue: string | null
    placeholder: string
    onSelect: (value: string | null) => void
    disabled: boolean
    dispatch: Dispatch<{ type: string; payload: unknown }>
}

const Combobox: FC<ComboboxProps> = ({ items, selectedValue, placeholder, onSelect, disabled, dispatch }) => {
    const [open, setOpen] = useState(false)

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
                        {selectedValue
                            ? items.find(item => item.value === selectedValue)?.label
                            : placeholder}
                    </span>
                    {selectedValue ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(null);
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
                        <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
                        <CommandGroup>
                            {items.map(item => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => {
                                        const newValue = item.value === selectedValue ? null : item.value
                                        onSelect(newValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedValue === item.value ? "opacity-100" : "opacity-0"
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

export default Combobox
