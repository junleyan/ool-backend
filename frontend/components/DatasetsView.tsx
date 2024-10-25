import { State, Tag } from "./App";
import { Dispatch } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry from 'react-masonry-css';
import { Badge } from "./ui/badge";

interface DatasetsViewProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

interface resourceProps {
    format: string;
    name: string;
    created: string;
    state: string;
    url: string;
    position: number;
}

interface DatasetProps {
    author: string;
    license_id: string;
    license_title: string;
    state: string;
    title: string;
    notes: string;
    resources: resourceProps[];
    tags: Tag[];
}

const badgeColors = [
    "#E53935", "#FF8A65", "#5D3FD3", "#00796B", "#6D4C41",
    "#6BC04A", "#43A047", "#00ACC1", "#FFB300", "#039BE5", "#1E88E5",
    "#3949AB", "#7E57C2", "#AB47BC", "#BC306A", "#FF5252", "#303030"
];

const formats = [
    "CSV", "HTML", "ArcGIS GeoServices REST API", "GeoJSON", "ZIP", "KML", "JSON", "RDF", 
    "XML", "OGC WFS", "OGC WMS", "XLSX", "KMZ", "XLS", "PDF", "MP4"
];

const formatColorMap = new Map(formats.map((format, index) => [format, badgeColors[index % badgeColors.length]]));

const datasetArr = (sortBy: string, datasets: DatasetProps[], searchQuery: string) => {
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
                tags={dataset.tags}
                state={dataset.state}
                author={dataset.author}
                license_id={dataset.license_id}
                license_title={dataset.license_title}
                resources={dataset.resources}
            />
        ));
};

const Dataset: React.FC<DatasetProps> = ({ title, notes, tags, resources, author }) => {
    return (
        <Card className="w-full mb-4 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="break-words whitespace-normal">
                    <div dangerouslySetInnerHTML={{ __html: notes }} />
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap">
                {resources
                    .filter(resource => resource.state === 'active')
                    .filter(resource => formats.includes(resource.format)) // !!! Change later ???
                    .map((resource, index) => (
                        <a key={index} href={resource.url} target="_blank">
                            <Badge 
                                className="m-0.5" 
                                style={{ backgroundColor: formatColorMap.get(resource.format) }}
                            >
                                {resource.format}
                            </Badge>
                        </a>

                ))}
            </CardFooter>
            <CardFooter className="flex flex-wrap">
                {tags.map((tag, index) => (
                    <Badge className="m-0.5" key={index}>{tag.display_name}</Badge>
                ))}
            </CardFooter>
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
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
        >
            {datasetArr(state.sortBy, state.datasets, state.searchQuery)}
        </Masonry>
    );
};

export default DatasetsView;
