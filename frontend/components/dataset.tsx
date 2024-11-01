import { Resource, State, Tag } from "@/app/page";
import { Dispatch, FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { getFormatColor } from "@/utils/convert";
import Masonry from 'react-masonry-css';

interface DatasetProps {
    state: string;
    name: string;
    title: string;
    notes: string;
    resources: Resource[];
    tags: Tag[];
}

const InfoCard: FC<{ dataset: DatasetProps }> = ({ dataset }) => {
    return (
        <Card className="mx-2 my-4 shadow-md transform transition-transform hover:scale-101 hover:-translate-y-1 hover:shadow-lg max-w-md">
            <CardHeader>
                <CardTitle>{dataset.title}</CardTitle>
                {
                    dataset.notes.length > 0 &&
                    <CardDescription className="break-words whitespace-normal">
                        <div dangerouslySetInnerHTML={{ __html: dataset.notes }} />
                    </CardDescription>
                }
            </CardHeader>
            {
                (dataset.resources.length > 0 || dataset.tags.length > 0) && (
                    <CardContent>
                        {/* Section for Tag Badges */}
                        {dataset.tags.length > 0 && (
                            <div>
                                {dataset.tags.map((tag, index) => (
                                    <Badge variant="secondary" key={index} className="m-0.5">
                                        {tag.display_name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {/* Section for Format Badges */}
                        {dataset.resources.length > 0 && (
                            <div className="mt-2">
                                {dataset.resources
                                    .filter((resource) => resource.format.length > 0)
                                    .map((resource, index) => (
                                        <Badge key={index}
                                            className="m-0.5"
                                            style={{ backgroundColor: getFormatColor(resource.format) }}
                                        >
                                            {resource.format}
                                        </Badge>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                )
            }
        </Card>
    );
};

const BREAK_POINT_COLUMNS_OBJ = {
    default: 3,
    1280: 2,
    800: 1
};

const Datasets: FC<{ state: State; dispatch: Dispatch<{ type: string; payload: unknown }> }> = ({ state, dispatch }) => {
    return (
        <Masonry
            breakpointCols={BREAK_POINT_COLUMNS_OBJ}
            className="flex mx-5"
            columnClassName="bg-clip-padding"
        >
            {state.datasets.map((dataset, index) => (
                <InfoCard key={index} dataset={dataset} />
            ))}
        </Masonry>
    );
};


export default Datasets;
