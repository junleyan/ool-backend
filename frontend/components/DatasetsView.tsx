import { State, Tag } from "./App";
import { Dispatch } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry from 'react-masonry-css';
import { Badge } from "./ui/badge";

interface DatasetsViewProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

interface DatasetProps {
    title: string;
    notes: string;
    tags: Tag[];
}

const Dataset: React.FC<DatasetProps> = ({ title, notes, tags }) => {
    return (
        <Card className="w-full mb-4 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="flex flex-wrap">
                    <div dangerouslySetInnerHTML={{ __html: notes }} />
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap">
                {tags.map((tag, index) => (
                    <Badge className="m-0.5" key={index}>{tag.display_name}</Badge>
                ))}
            </CardFooter>
        </Card>
    );
};

const DatasetsView: React.FC<DatasetsViewProps> = ({ state, dispatch }) => {

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
        >
            {state.datasets.map((dataset, index) => (
                <Dataset
                    key={index}
                    title={dataset.title}
                    notes={dataset.notes}
                    tags={dataset.tags}
                />
            ))}
        </Masonry>
    );
};

export default DatasetsView;
