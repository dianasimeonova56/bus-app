export const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export const formatResponse = (data, totalDocs, page, limit) => {
    const totalPages = Math.ceil(totalDocs / limit);
    return {
        docs: data,
        meta: {
            totalDocs,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};