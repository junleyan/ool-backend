import { Dataset, State } from "@/app/page"
import { Sidebar, SidebarContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction, SidebarMenuSub, SidebarGroup, SidebarFooter } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Building, ChevronRightIcon, Tags, Users, X as CloseIcon, Sun, Moon, Clock } from "lucide-react"
import { Dispatch } from "react"
import Combobox from "../filters/combobox"
import MultiSelectCombobox from "../filters/multi-select-combobox"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { stat } from "fs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "sonner";

interface FilterBadgeProps {
    value: string
    getLabel: (value: string) => string
    onRemove: () => void
}

const RecentOption = ({ dataset, state, dispatch }: { dataset: Dataset, state: State, dispatch: Dispatch<{ type: string; payload: unknown }> }) => {
    
    const updateRecentDatasets = (dataset: Dataset) => {
        const recentDatasets = state.recentDatasets;
        const updatedRecentDatasets = recentDatasets.filter((recentDataset) => recentDataset.name !== dataset.name);
        updatedRecentDatasets.unshift(dataset);
        if (updatedRecentDatasets.length > 5) {
            updatedRecentDatasets.pop();
        }
        return updatedRecentDatasets;
    }

    const handleRecentClick = () => {
        const previousSelectDataset = state.selectedDataset;
        dispatch({ type: "stage", payload: "visualize" });
        dispatch({ type: "recentDatasets", payload: updateRecentDatasets(dataset) });
        dispatch({ type: "selectedDataset", payload: dataset });
        toast("Dataset Selected!", {
            description: (
                <>
                    <i>{dataset.title}</i>
                </>
            ),
            action: {
                label: "Undo",
                onClick: () => {
                    dispatch({ type: "stage", payload: "select" });
                    dispatch({ type: "selectedDataset", payload: previousSelectDataset });
                    toast("Undone Selection!");
                }
            }
        });
    };

    return (
        <li
            className="cursor-pointer p-2 mb-2 bg-gray-100
                        text-sm hover:bg-stone-200
                        rounded-md transition-all
                        duration-200 ease-in-out
                        transform hover:scale-105"
            onClick={handleRecentClick}
        >
            {dataset.title}
        </li>
    );
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ value, getLabel, onRemove }) => {
    const label = getLabel(value)

    return (
        <Badge variant="outline" className="flex items-center gap-1 max-w-56">
            <span className="truncate overflow-hidden">{label}</span>
            <CloseIcon
                size={12}
                className="cursor-pointer ml-1 flex-shrink-0"
                onClick={onRemove}
            />
        </Badge>

    )
}

const AppSidebar = ({ state, dispatch }: { state: State, dispatch: Dispatch<{ type: string; payload: unknown }> }) => {

    const { setTheme } = useTheme()

    const getGroupLabel = (value: string) => {
        const group = state.filters.groups.find(group => group.value === value)
        return group ? group.label : value
    }

    const getTagLabel = (value: string) => {
        const tag = state.filters.tags.find(tag => tag.value === value)
        return tag ? tag.label : value
    }

    const handleSelect = (type: string, payload: unknown) => {
        dispatch({ type, payload })
    }

    const handleRemove = (type: string, updatedValues: unknown[]) => {
        dispatch({ type, payload: updatedValues })
    }

    return (
        <Sidebar>
            {/* Header */}
            <SidebarHeader className="flex">
                <div className="flex justify-center items-center gap-4 mt-2">
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Seal_of_the_State_of_Hawaii.svg"
                        alt="Seal of the State of Hawaii"
                        width={60}
                        height={60} />
                    <div className="mr-2">
                        <p className="text-sm font-bold">Hawaii Open Data</p>
                        <p className="text-xs text-muted-foreground">Government that is</p>
                        <p className="text-xs text-muted-foreground"><b>open</b> and <b>transparent</b></p>
                    </div>
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent className="flex">
                <SidebarGroup>
                    <SidebarGroupLabel>Filter by publishing organization</SidebarGroupLabel>
                    <SidebarMenu className="mb-3">
                        <Collapsible asChild defaultOpen={true}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Organizations">
                                    <div className="flex items-center gap-2">
                                        <Building />
                                        <span>Organization</span>
                                    </div>
                                </SidebarMenuButton>

                                <CollapsibleTrigger asChild>
                                    <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                                        <ChevronRightIcon />
                                        <span className="sr-only">Toggle</span>
                                    </SidebarMenuAction>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <Combobox
                                            dispatch={dispatch}
                                            disabled={state.isLoadingFilters}
                                            items={state.filters.organizations}
                                            selectedValue={state.organization}
                                            placeholder="Select organization..."
                                            onSelect={(newValue) => handleSelect("organization", newValue)}
                                        />
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>

                    {/* Groups Filter */}
                    <SidebarGroupLabel>Filter by publishing groups</SidebarGroupLabel>
                    <SidebarMenu className="mb-3">
                        <Collapsible asChild defaultOpen={true}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Groups">
                                    <div className="flex items-center gap-2">
                                        <Users />
                                        <span>Groups</span>
                                    </div>
                                </SidebarMenuButton>

                                <CollapsibleTrigger asChild>
                                    <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                                        <ChevronRightIcon />
                                        <span className="sr-only">Toggle</span>
                                    </SidebarMenuAction>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <MultiSelectCombobox
                                            disabled={state.isLoadingFilters}
                                            items={state.filters.groups}
                                            selectedValues={state.groups}
                                            name="organization"
                                            placeholder="Select groups..."
                                            onSelect={(newValues: string[]) => handleSelect("groups", newValues)}
                                            clear={() => {
                                                dispatch({ type: "groups", payload: [] })
                                            }}
                                        />
                                    </SidebarMenuSub>
                                    {/* Display selected groups as badges */}
                                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                                        {state.groups.map((group) => (
                                            <FilterBadge
                                                key={group}
                                                value={group}
                                                getLabel={getGroupLabel}
                                                onRemove={() => handleRemove("groups", state.groups.filter((g) => g !== group))}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>

                    {/* Tags Filter */}
                    <SidebarGroupLabel>Filter by attached tags</SidebarGroupLabel>
                    <SidebarMenu className="mb-3">
                        <Collapsible asChild defaultOpen={true}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Tags">
                                    <div className="flex items-center gap-2">
                                        <Tags />
                                        <span>Tags</span>
                                    </div>
                                </SidebarMenuButton>

                                <CollapsibleTrigger asChild>
                                    <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                                        <ChevronRightIcon />
                                        <span className="sr-only">Toggle</span>
                                    </SidebarMenuAction>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <MultiSelectCombobox
                                            disabled={state.isLoadingFilters}
                                            items={state.filters.tags}
                                            selectedValues={state.tags}
                                            name="tags"
                                            placeholder="Select tags..."
                                            onSelect={(newValues: string[]) => {
                                                handleSelect("tags", newValues)

                                            }}
                                            clear={() => {
                                                dispatch({ type: "tags", payload: [] })
                                            }}
                                        />
                                    </SidebarMenuSub>
                                    {/* Display selected tags as badges */}
                                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                                        {state.tags.map((tag) => (
                                            <FilterBadge
                                                key={tag}
                                                value={tag}
                                                getLabel={getTagLabel}
                                                onRemove={() => handleRemove("tags", state.tags.filter((t) => t !== tag))}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>

                    {/* Recent Datasets */}
                    <SidebarMenu className="mb-3">
                        <Collapsible asChild defaultOpen={true}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Recent Datasets">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock />
                                        <span>Recent Datasets</span>
                                    </div>
                                </SidebarMenuButton>
                                <div className="ml-4">
                                    <ul className="">
                                        {state.recentDatasets && state.recentDatasets.length > 0 ? (
                                            state.recentDatasets.slice(0, 4).map((dataset, index) => (
                                                <RecentOption
                                                    key={index}
                                                    dataset={dataset}
                                                    state={state}
                                                    dispatch={dispatch}
                                                />
                                            ))
                                        ) : (
                                            <li className="text-sm mb-2">No recent datasets available</li>
                                        )}
                                    </ul>
                                </div>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>

                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
