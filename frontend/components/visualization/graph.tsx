import { useState } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// Define the structure of each data entry
type DataEntry = {
    [key: string]: string | number;
};

// Define a type for the config object
type ChartConfig = {
    [key: string]: {
        label: string;
        color: string;
    };
};

// Define the props for the Graph component
interface GraphProps {
    data: DataEntry[];
    title: string;
    subtitle: string;
    xAxisKey: keyof DataEntry; // Initial X-axis key
    yAxisKeys: (keyof DataEntry)[]; // Initial Y-axis keys
    yAxisLabel?: string;
}

export function Graph({ data, title, subtitle, xAxisKey, yAxisKeys, yAxisLabel }: GraphProps) {
    // Get all keys in data as potential X and Y axis keys
    const allKeys = Object.keys(data[0] || {}) as (keyof DataEntry)[];

    // State for the currently selected Y-axis keys
    const [visibleYAxisKeys, setVisibleYAxisKeys] = useState(yAxisKeys);
    // State for the currently selected X-axis key
    const [selectedXAxisKey, setSelectedXAxisKey] = useState(xAxisKey);

    // Create a default config object based on allKeys, assigning colors for each key
    const defaultConfig: ChartConfig = allKeys.reduce((acc, key, index) => {
        acc[key as string] = {
            label: key as string,
            color: `hsl(var(--chart-${index + 1}))`,
        };
        return acc;
    }, {} as ChartConfig);

    // Calculate the maximum Y-axis value dynamically based on visible Y-axis keys
    const maxYAxisValue = Math.max(
        0,
        ...data.flatMap(entry =>
            visibleYAxisKeys.map(key => {
                const value = entry[key];
                const numericValue = typeof value === "number" ? value : parseFloat(value as string);
                return !isNaN(numericValue) ? Math.floor(numericValue) : 0;
            })
        )
    );

    // Calculate the minimum Y-axis value and set it to 80% of the smallest visible Y-axis value
    const minYAxisValue = Math.min(
        ...data.flatMap(entry =>
            visibleYAxisKeys.map(key => {
                const value = entry[key];
                const numericValue = typeof value === "number" ? value : parseFloat(value as string);
                return !isNaN(numericValue) ? numericValue : 0;
            })
        )
    );

    // Calculate the minimum and maximum X-axis values dynamically based on the selected X-axis key
    const xValues = data.map(entry => {
        const value = entry[selectedXAxisKey];
        return typeof value === "number" ? value : parseFloat(value as string);
    }).filter(value => !isNaN(value));
    const minXAxisValue = Math.min(...xValues);
    const maxXAxisValue = Math.max(...xValues);

    // Sort the data by the selected X-axis key to ensure the graph has a logical line flow
    const sortedData = [...data].sort((a, b) => {
        const aValue = typeof a[selectedXAxisKey] === "number" ? a[selectedXAxisKey] : parseFloat(a[selectedXAxisKey] as string);
        const bValue = typeof b[selectedXAxisKey] === "number" ? b[selectedXAxisKey] : parseFloat(b[selectedXAxisKey] as string);
        return aValue - bValue;
    });

    // Toggle function to update visible Y-axis keys
    const toggleYAxisKey = (key: keyof DataEntry) => {
        setVisibleYAxisKeys(prevKeys =>
            prevKeys.includes(key)
                ? prevKeys.filter(k => k !== key)
                : [...prevKeys, key]
        );
    };

    // Function to change the selected X-axis key
    const changeXAxisKey = (key: keyof DataEntry) => {
        setSelectedXAxisKey(key);
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={defaultConfig}>
                    <LineChart
                        data={sortedData} // Pass the sorted data to the chart for ordered X-axis
                        margin={{ left: 0, right: 12, bottom: 25 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            type="number"
                            domain={[minXAxisValue, maxXAxisValue]}
                            dataKey={selectedXAxisKey as string}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{
                                value: selectedXAxisKey, // Display the selected X-axis key name as the label
                                position: 'insideBottom',
                                offset: -20,
                                style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' },
                            }}
                        />
                        <YAxis
                            domain={[minYAxisValue, maxYAxisValue]} // Use the calculated Y-axis range
                            label={{
                                value: yAxisLabel || "Count",
                                angle: -90,
                                position: "insideLeft",
                                offset: 5,
                                style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' },
                            }}
                        />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        {visibleYAxisKeys.map((key, index) => (
                            <Line
                                key={String(key)}
                                dataKey={String(key)}
                                type="linear"
                                name={String(defaultConfig[key as string]?.label || key)}
                                stroke={defaultConfig[key as string]?.color}
                                dot={false}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-center justify-between text-sm">
                    {/* Y-Axis Toggle */}
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="ml-1">Toggle Axes</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-44">
                                {/* X-Axis Selection */}
                                <DropdownMenuLabel>Select X-Axis</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={selectedXAxisKey as string} onValueChange={(value) => changeXAxisKey(value as keyof DataEntry)}>
                                    {allKeys.map((key) => (
                                        <DropdownMenuRadioItem key={key as string} value={key as string}>
                                            {defaultConfig[key as string]?.label || key}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>

                                <DropdownMenuSeparator />

                                {/* Y-Axis Toggles */}
                                <DropdownMenuLabel>Toggle Y-Axis</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {allKeys.map((key) => (
                                    <DropdownMenuCheckboxItem
                                        key={key as string}
                                        checked={visibleYAxisKeys.includes(key)}
                                        onCheckedChange={() => toggleYAxisKey(key)}
                                    >
                                        {defaultConfig[key as string]?.label || key}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="text-muted-foreground">Powered by <b>OpenAI</b></div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default Graph;
