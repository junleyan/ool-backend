export const getRawCSV = async (data) => {
    const CHUNKS = [];
    const CSV = await new Promise((resolve, reject) => {
        data.on("data", (chunk) => CHUNKS.push(chunk));
        data.on("end", () => resolve(Buffer.concat(CHUNKS).toString()));
        data.on("error", (err) => reject(err));
    });
    return CSV;
};
