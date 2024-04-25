export const getPagingData = (data, page, limit) => {
    let totalItems = data.count ? data.count : data.length;
    let items = data.rows ? data.rows : data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
};

export const getPagination = (page, size) => {
    const limit = size ? +size : 100;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
