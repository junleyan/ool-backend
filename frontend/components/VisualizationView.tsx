import { Dispatch, FC } from "react";
import { State } from "./App";
import CSVTable from "./CSVTable";

interface VisualizationViewProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const VisualizationView: FC<VisualizationViewProps> = ({ state, dispatch }) => {
    return (
        <>
            <CSVTable csv={state.csv} title={state.selectedDataset.title} />
        </>
    );
};

export default VisualizationView;
