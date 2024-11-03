export const FORMATS = [
    "CSV", "HTML", "ArcGIS GeoServices REST API", "GeoJSON", "ZIP", "KML", "JSON", "RDF", 
    "XML", "OGC WFS", "OGC WMS", "XLSX", "KMZ", "XLS", "PDF", "MP4"
];

export const getFormatColor = (format: string) => {
    console.log(format)
    const BADGE_COLORS = [
        "#E53935", "#FF8A65", "#5D3FD3", "#00796B", "#6D4C41",
        "#6BC04A", "#43A047", "#00ACC1", "#FFB300", "#039BE5", "#1E88E5",
        "#3949AB", "#7E57C2", "#AB47BC", "#BC306A", "#FF5252", "#303030"
    ];
    
    const formatColorMap = new Map(FORMATS.map((format, index) => [format, BADGE_COLORS[index % BADGE_COLORS.length]]));
    return formatColorMap.get(format);
};
