import mongoose from 'mongoose';
import chalk from 'chalk';

export default (data, totalPages, hasNextPage, pageArray) => {

    const response = {
        _metadata: {
            hasNextPage,
            page: req.query.page,
            limit: req.query.limit,
            skip: req.skip,
            totalPages,
            totalDocuments: documentsCount
        },
        _links: {
            prev: (totalPages > 2 ? pageArray[0].url : undefined),
            self: (totalPages > 2 ? pageArray[1].url : pageArray[0].url),
            next: (totalPages > 2 ? pageArray[2].url : undefined)
        },
        data
    };

    if (totalPages > 1) {
        if (req.query.page === 1) {
            delete response._links.prev;
            response._links.self = pageArray[0].url;
            response._links.next = pageArray[1].url;
        }

        if (!hasNextPage) {
            response._links.prev = (totalPages > 2 ? pageArray[1].url : pageArray[0].url);
            response._links.self = (totalPages > 2 ? pageArray[2].url : pageArray[1].url);
            delete response._links.next;
        }
    }
    else {
        delete response._links.prev;
        delete response._links.next;
    }

    return response;
}