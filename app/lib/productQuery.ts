export const productQuery = (body: string) => `
    query productsQuery ($limit:Int, $query: String, $cursor: String) {
        products (first: $limit, query:$query, reverse: true, sortKey: TITLE, after: $cursor) {
            nodes {
                ${body}
            }
            pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;
