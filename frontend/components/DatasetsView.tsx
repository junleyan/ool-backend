import { State, Tag } from "./App";
import { Dispatch } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry from 'react-masonry-css';
import { Badge } from "./ui/badge";
import SortBy from "./SortBy";
import { data } from "@/utils/data";

interface DatasetsViewProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

interface DatasetProps {
    state: string;
    title: string;
    notes: string;
    tags: Tag[];
}

const conjunctions: string[] = ["and", "of", "in", "to", "a", "for", "the", "with", "on", "by", "as", "at", "from", "about", "but", "or", "an", "into", "this", "like"];

const capitalizeTitle = (title: string): string => {
  return title
    .split(' ')
    //if the word is not a conjunction, capitalize the first letter
    .map(word => (!conjunctions.includes(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
};

const stripHTMLFormat = (html: string): string => {
  let strippedHTML = html;
  strippedHTML = strippedHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/g, ''); // Remove <style> tags and their content
  strippedHTML = strippedHTML.replace(/style=['"][^'"]*['"]/g, ''); // Remove style attributes
  return strippedHTML;
};

const datasetArr = (sortBy: string, datasets: DatasetProps[]) => {
  const unsorted = datasets.filter( dataset => dataset.state === 'active').map((dataset, index) => (
    <Dataset
      key={index}
      title={dataset.title}
      notes={dataset.notes}
      tags={dataset.tags}
      state={dataset.state}
    />
  ));

  switch (sortBy) {
    case 'relevance':
      return unsorted;
      break;
    case 'name-asc':
      return unsorted.sort((a, b) => a.props.title.localeCompare(b.props.title));
      break;
    case 'name-desc':
      return unsorted.sort((a, b) => b.props.title.localeCompare(a.props.title));
      break;
    case 'last-modified':
      return unsorted;
      break;
    case 'popularity':
      return unsorted;
      break;
  }
}

const Dataset: React.FC<DatasetProps> = ({ title, notes, tags }) => {
  const sanitizedNotes = stripHTMLFormat(notes);
  const formattedTitle = capitalizeTitle(title);

  return (
      <Card className="w-full mb-4 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50">
          <CardHeader>
              <CardTitle>{formattedTitle}</CardTitle>
              <CardDescription className="break-words whitespace-normal">
                <div dangerouslySetInnerHTML={{ __html: sanitizedNotes }} />
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
            {datasetArr(state.sortBy, state.datasets)}
        </Masonry>
    );
};

export default DatasetsView;
