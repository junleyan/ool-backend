import { State } from "@/app/page"
import { Sidebar, SidebarContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction, SidebarMenuSub, SidebarGroup } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Building, ChevronRightIcon, Tags, Users, X as CloseIcon } from "lucide-react"
import { Dispatch } from "react"
import Combobox from "./filters/combobox"
import MultiSelectCombobox from "./filters/multi-select-combobox"

interface FilterBadgeProps {
    value: string
    getLabel: (value: string) => string
    onRemove: () => void
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
                        <p className="text-xs text-gray-700">Government that is</p>
                        <p className="text-xs text-gray-700"><b>open</b> and <b>transparent</b></p>
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
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
