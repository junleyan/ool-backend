import { Dispatch } from "react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { State } from "./App";
import { Separator } from "./ui/separator";
import MultiSelectCombobox from "./MultiSelectCombobox";
import Combobox from "./Combobox";

interface SidebarProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Sidebar: React.FC<SidebarProps> = ({ state, dispatch }) => {
    return (
        <div className="flex h-full flex-col items-center justify-start p-6">
            <div className="flex items-center">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Seal_of_the_State_of_Hawaii.svg"
                    alt="Seal of the State of Hawaii"
                    width={75}
                    height={75} />
                <div className="ml-4">
                    <p className="text-base font-bold">Hawaii Open Data</p>
                    <p className="text-sm text-gray-700">Government that is</p>
                    <p className="text-sm text-gray-700"><b>open</b> and <b>transparent</b></p>
                </div>
            </div>
            <Separator className="mt-5 mb-3" />
            <ScrollArea>
                <Combobox
                    label="Organization"
                    placeholder="Select organization..."
                    selectedValue={state.organization}
                    options={state.filters?.organizations || []}
                    dispatch={dispatch}
                    stateKey="organization"
                    isLoading={state.isLoadingFilters}
                />

                <Separator className="my-3" />

                <MultiSelectCombobox
                    label="Groups"
                    selectedItems={state.groups}
                    items={state.filters?.groups || []}
                    dispatch={dispatch}
                    stateKey="groups"
                    isLoading={state.isLoadingFilters}
                />

                <Separator className="my-3" />

                <MultiSelectCombobox
                    label="Tags"
                    selectedItems={state.tags}
                    items={state.filters?.tags || []}
                    dispatch={dispatch}
                    stateKey="tags"
                    isLoading={state.isLoadingFilters}
                />
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
