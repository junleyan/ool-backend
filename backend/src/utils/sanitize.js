export const sanitizeNotes = (data) => {
    return data.map((dataset) => {
        let notes = dataset.notes || '';

        notes = notes.replace(/<(style|script|iframe|object|embed|form|img|video)[^>]*>.*?<\/\1>/gi, '');
        notes = notes.replace(/\s*(onerror|onclick|onload|style|size|width|height|frameborder|allowfullscreen)="[^"]*"/gi, '');

        const formattedNotes = notes
            .replace(/&nbsp;/g, '')
            .replace(/\s*Description:\s*/, '<br><br>Description:<br>');

        return {
            ...dataset,
            notes: formattedNotes
        };
    });
};