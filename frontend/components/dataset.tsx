import { Resource, State, Tag } from "@/app/page";
import { Dispatch, FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { getFormatColor } from "@/utils/convert";
import Masonry from '@mui/lab/Masonry';

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

const Datasets: FC<{ state: State; dispatch: Dispatch<{ type: string; payload: unknown }> }> = ({ state, dispatch }) => {
    const searchQuery = state.datasetSearchQuery.toLowerCase();

    const filteredDatasets = state.datasets.filter((dataset) =>
        dataset.title.toLowerCase().includes(searchQuery) ||
        dataset.notes.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="mx-5 mt-5">
            <Masonry
                columns={{ xs: 1, sm: 2, md: 3 }}
                spacing={2}
                className="flex overflow-x-hidden"
            >
                {filteredDatasets.map((dataset, index) => (
                    <InfoCard key={index} dataset={dataset} />
                ))}
            </Masonry>
        </div>
    );
};

export default Datasets;
