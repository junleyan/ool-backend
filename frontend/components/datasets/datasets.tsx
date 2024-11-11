import { Dataset, State } from "@/app/page";
import { Dispatch, FC, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getFormatColor } from "@/utils/convert";
import Masonry from '@mui/lab/Masonry';
import { Bookmark, BookmarkCheck, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface InfoCardProps {
    dataset: Dataset;
    showTags: boolean;
    showFormats: boolean;
    state: State;
    dispatch: React.Dispatch<{ type: string; payload: unknown }>;
}

const InfoCard: FC<InfoCardProps> = ({ dataset, showTags, showFormats, state, dispatch }) => {
    const resourceTypes = {
        "download": ["CSV", "GeoJSON", "ZIP", "KML", "JSON", "RDF", "XLSX", "KMZ", "XLS", "PDF"],
        "web": ["HTML", "ArcGIS GeoServices REST API", "XML", "OGC WFS", "OGC WMS", "PDF", "MP4"]
    }

    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarked") || "[]");
        setIsBookmarked(bookmarks.includes(dataset.name));
    }, [dataset.name]);

    const handleBookmarkToggle = () => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarked") || "[]");
        let updatedBookmarks;

        if (isBookmarked) {
            updatedBookmarks = bookmarks.filter((name: string) => name !== dataset.name);
        } else {
            updatedBookmarks = [...bookmarks, dataset.name];
        }

        localStorage.setItem("bookmarked", JSON.stringify(updatedBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const updateRecentDatasets = (dataset: Dataset) => {
        const recentDatasets = state.recentDatasets;
        const updatedRecentDatasets = recentDatasets.filter((recentDataset) => recentDataset.name !== dataset.name);
        updatedRecentDatasets.unshift(dataset);
        if (updatedRecentDatasets.length > 5) {
            updatedRecentDatasets.pop();
        }
        return updatedRecentDatasets;
    }

    const handleCardHeaderClick = () => {
        const previousSelectDataset = state.selectedDataset;
        dispatch({ type: "stage", payload: "visualize" });
        const UPDATED_RECENT_DATASET = updateRecentDatasets(dataset);
        dispatch({ type: "recentDatasets", payload: UPDATED_RECENT_DATASET });
        dispatch({ type: "selectedDataset", payload: dataset });
        localStorage.setItem("recent-dataset", JSON.stringify(UPDATED_RECENT_DATASET));
        toast("Dataset Selected!", {
            description: (
                <>
                    <i>{dataset.title}</i>
                </>
            ),
            action: {
                label: "Undo",
                onClick: () => {
                    dispatch({ type: "stage", payload: "select" });
                    dispatch({ type: "selectedDataset", payload: previousSelectDataset });
                    toast("Undone Selection!");
                }
            }
        });
    };

    return (
        <Card className="mx-2 my-4 shadow-md transform transition-transform hover:scale-101 hover:-translate-y-1 hover:shadow-lg max-w-md relative">
            {/* Bookmark Icon */}
            <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={handleBookmarkToggle}
            >
                {isBookmarked ? (
                    <BookmarkCheck className="text-blue-500" />
                ) : (
                    <Bookmark className="text-gray-500" />
                )}
            </div>

            <CardHeader className="cursor-pointer" onClick={handleCardHeaderClick}>
                <CardTitle>{dataset.title}</CardTitle>
                {dataset.notes.length > 0 && (
                    <CardDescription className="break-words whitespace-normal">
                        <div dangerouslySetInnerHTML={{ __html: dataset.notes }} />
                    </CardDescription>
                )}
            </CardHeader>
            {(dataset.resources.length > 0 || dataset.tags.length > 0 || showTags || showFormats) && (
                <CardContent>
                    {/* Section for Tag Badges */}
                    {dataset.tags.length > 0 && showTags && (
                        <div>
                            {dataset.tags.map((tag, index) => (
                                <Badge variant="secondary" key={index} className="m-0.5">
                                    {tag.display_name}
                                </Badge>
                            ))}
                        </div>
                    )}
                    {/* Section for Format Badges */}
                    {dataset.resources.length > 0 && showFormats && (
                        <div className="mt-2">
                            {dataset.resources
                                .filter((resource) => resource.format.length > 0)
                                .map((resource, index) => (
                                    <a key={index} href={resource.url} target="_blank">
                                        <Badge
                                            key={index}
                                            className="m-0.5"
                                            style={{ backgroundColor: getFormatColor(resource.format) }}
                                            title={
                                                resourceTypes.download.includes(resource.format)
                                                    ? "Download " + resource.format
                                                    : "View " + resource.format
                                            }
                                        >
                                            <div className="flex items-center">
                                                <span className="text-white">{resource.format}</span>
                                                {resourceTypes.download.includes(resource.format) ? (
                                                    <Download className="ml-1" color="white" size={14} />
                                                ) : (
                                                    <ExternalLink className="ml-1" color="white" size={14} />
                                                )}
                                            </div>
                                        </Badge>
                                    </a>
                                ))}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

const Datasets: FC<{ state: State; dispatch: Dispatch<{ type: string; payload: unknown }> }> = ({ state, dispatch }) => {
    const searchQuery = state.datasetSearchQuery.toLowerCase();
    const searchTerms = searchQuery.split(" ").filter(term => term.length > 0);

    // Fetch bookmarks from localStorage
    const getBookmarks = () => JSON.parse(localStorage.getItem("bookmarked") || "[]");

    // Filter datasets based on search query and bookmark status
    const filteredDatasets = state.datasets.filter((dataset) => {
        const matchesSearch = dataset.title.toLowerCase().includes(searchQuery) || dataset.notes.toLowerCase().includes(searchQuery);
        const isBookmarked = getBookmarks().includes(dataset.name);

        // Show only bookmarked datasets if "showBookmarkedOnly" is enabled
        if (state.datasetShowBookmarkOnly) {
            return matchesSearch && isBookmarked;
        }
        return matchesSearch;
    });

    const sortedDatasets = filteredDatasets.sort((a, b) => {
        switch (state.datasetSort) {
            case "alphabetical ascending":
                return a.title.localeCompare(b.title);
            case "alphabetical descending":
                return b.title.localeCompare(a.title);
            case "time ascending":
                return new Date(a.metadata_created).getTime() - new Date(b.metadata_created).getTime();
            case "time descending":
                return new Date(b.metadata_created).getTime() - new Date(a.metadata_created).getTime();
            case "relevance":
                const relevanceScore = (dataset: Dataset) => {
                    const title = dataset.title.toLowerCase();
                    const notes = dataset.notes.toLowerCase();

                    let score = 0;
                    searchTerms.forEach(term => {
                        if (title.includes(term)) score += 10;
                        if (notes.includes(term)) score += 5;
                        score += (title.match(new RegExp(term, "g")) || []).length;
                        score += (notes.match(new RegExp(term, "g")) || []).length;
                    });

                    return score;
                };

                return relevanceScore(b) - relevanceScore(a);
            default:
                return 0;
        }
    });

    return (
        <div className="mx-5 mt-5">
            <Masonry
                columns={{ xs: 1, sm: 2, md: 3 }}
                spacing={2}
                className="flex overflow-x-hidden"
            >
                {sortedDatasets
                    .filter(dataset => dataset.resources.some(resource => resource.format === 'CSV'))
                    .map((dataset, index) => (
                        <InfoCard 
                            key={index} 
                            dataset={dataset} 
                            showTags={state.datasetShowTags} 
                            showFormats={state.datasetShowFormats} 
                            state={state} 
                            dispatch={dispatch} 
                        />
                    ))}
            </Masonry>
        </div>
    );
};

export default Datasets;
