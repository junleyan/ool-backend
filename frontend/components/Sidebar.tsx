import { Dispatch } from "react";
import Image from "next/image";
import OrganizationCombobox from "./OrganizationCombobox";
import { ScrollArea } from "./ui/scroll-area";
import { State } from "./App";
import { Separator } from "./ui/separator";
import MultiSelectCombobox from "./MultiSelectCombobox";

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
                {/* Organization Combobox */}
                <OrganizationCombobox state={state} dispatch={dispatch} />

                <Separator className="my-3" />

                {/* Group Combobox */}
                <MultiSelectCombobox
                    label="Groups"
                    selectedItems={state.groups}
                    items={state.filters.groups}
                    dispatch={dispatch}
                    stateKey="groups"
                />
                <Separator className="my-3" />

                {/* Tag Combobox */}
                <MultiSelectCombobox
                    label="Tags"
                    selectedItems={state.tags}
                    items={state.filters.tags}
                    dispatch={dispatch}
                    stateKey="tags"
                />
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
