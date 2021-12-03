
export default (data, pagination) => {

    console.log(data);
    if (data.length === 0) {

        return {
            _metadata: {},
            _links: {},
            data
        };
    }

    let response = {
        _metadata: {
            hasNextPage: pagination.hasNextPage,
            page: pagination.page,
            limit: pagination.limit,
            skip: pagination.skip,
            totalPages: pagination.totalPages,
            totalDocuments: pagination.totalDocuments
        },
        _links: {
            prev: (pagination.totalPages > 2 ? pagination.pageArray[0].url : undefined),
            self: (pagination.totalPages > 2 ? pagination.pageArray[1].url : pagination.pageArray[0].url),
            next: (pagination.totalPages > 2 ? pagination.pageArray[2].url : undefined)
        },
        data
    };

    if (pagination.totalPages > 1) {
        if (pagination.page === 1) {
            delete response._links.prev;
            response._links.self = pagination.pageArray[0].url;
            response._links.next = pagination.pageArray[1].url;
        }

        if (!pagination.hasNextPage) {
            response._links.prev = (pagination.totalPages > 2 ? pagination.pageArray[1].url : pagination.pageArray[0].url);
            response._links.self = (pagination.totalPages > 2 ? pagination.pageArray[2].url : pagination.pageArray[1].url);
            delete response._links.next;
        }
    }
    else {
        delete response._links.prev;
        delete response._links.next;
    }

    return response;
}