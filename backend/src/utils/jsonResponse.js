export const sendJsonResponse = (res, status, message, data) => {
    const payload = {
        status,
        message,
        ...(data && { data })
    };
    res.status(status).json(payload);
};
