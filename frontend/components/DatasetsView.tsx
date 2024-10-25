import { Resource, State, Tag } from "./App";
import { Dispatch } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry from 'react-masonry-css';
import { Badge } from "./ui/badge";
import { FORMATS, getFormatColor } from "@/utils/convert";

interface DatasetsViewProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

interface DatasetProps {
    state: string;
    title: string;
    notes: string;
    resources: Resource[];
    tags: Tag[];
}

const datasetArr = ({ sortBy, datasets, searchQuery, showTags, showFormats }: {sortBy: string, datasets: DatasetProps[], searchQuery: string, showTags: boolean, showFormats: boolean}) => {
    return datasets
        .filter(dataset => dataset.state === 'active')
        .filter(dataset => {
            return (
                dataset.title.toLowerCase().slice(0, searchQuery.length) === searchQuery.toLowerCase()
                || dataset.title.toLowerCase().includes(searchQuery.toLowerCase())
                || dataset.notes.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }) 
        .sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'last-modified':
                    return 0;
                case 'popularity':
                    return 0;
                default:
                    return 0;
            }
        })
        .map((dataset, index) => (
            <Dataset
                key={index}
                title={dataset.title}
                notes={dataset.notes}
                tags={showTags ? dataset.tags : []}
                state={dataset.state}
                resources={showFormats ? dataset.resources : []}
            />
        ));
};

const Dataset: React.FC<DatasetProps> = ({ title, notes, tags, resources }) => {
    return (
        <Card className="w-full mb-4 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {
                    notes.length > 0 && 
                        <CardDescription className="break-words whitespace-normal">
                            <div dangerouslySetInnerHTML={{ __html: notes }} />
                        </CardDescription>
                }
            </CardHeader>
            {
                resources.length > 0 &&
                    <CardContent className="flex flex-wrap">
                        {resources
                            .filter(resource => resource.state === 'active')
                            .filter(resource => FORMATS.includes(resource.format)) // !!! Change later ???
                            .map((resource, index) => (
                                <Badge key={index}
                                    className="m-0.5" 
                                    style={{ backgroundColor: getFormatColor(resource.format) }}
                                >
                                    {resource.format}
                                </Badge>
                        ))}
                    </CardContent>
            }
            {
                tags.length > 0 &&
                    <CardFooter className="flex flex-wrap">
                        {tags.map((tag, index) => (
                            <Badge className="m-0.5" key={index}>{tag.display_name}</Badge>
                        ))}
                    </CardFooter>
            }
        </Card>
    );
};

const DatasetsView: React.FC<DatasetsViewProps> = ({ state, dispatch }) => {

    const BREAK_POINT_COLUMNS_OBJ = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <Masonry
            breakpointCols={BREAK_POINT_COLUMNS_OBJ}
            className="flex -ml-4 w-auto mt-2"
            columnClassName="pl-4 bg-clip-padding"
        >
            {datasetArr(state)}
        </Masonry>
    );
};

export default DatasetsView;
