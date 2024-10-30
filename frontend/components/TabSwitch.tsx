import {  Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { State } from "./App";
import { Dispatch } from "react";

interface TabSwitchProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ state, dispatch }) => {
    const handleTabClick = (value: string) => {
        if (value === "Datasets") {
            dispatch({ type: 'visualize', payload: false });
        } else if (value === "Visualize") {
            dispatch({ type: 'visualize', payload: true });
        }
    };

    const selectedTab = state.visualize ? "Visualize" : "Datasets"; // Determine selected tab from state

    return (
        <div className="flex items-center justify-center">
            <Tabs value={selectedTab} className="w-[400px]" onValueChange={handleTabClick}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Datasets">Datasets</TabsTrigger>
                    <TabsTrigger disabled={!state.selectedDataset.name} value="Visualize">Visualize</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default TabSwitch;