const API_ENDPOINT = 'https://api.chucknorris.io';

export async function searchJokes(term) {
    if (term) {
        const json = await getJSONResponse(
            `${API_ENDPOINT}/jokes/search?query=${term}`,
        );

        const { total, result } = json;

        return {
            total,
            items: result.map(asJoke),
        };
    } else {
        const json = await getJSONResponse(`${API_ENDPOINT}/jokes/random`);

        const result = {
            total: 1,
            items: [asJoke(json)],
        };

        console.log(result);

        return result;
    }
}

function asJoke(json) {
    const {
        ['created_at']: createdAt,
        id,
        ['updated_at']: updatedAt,
        url,
        value,
    } = json;

    const joke = {
        createdAt: new Date(createdAt),
        id,
        updatedAt: new Date(updatedAt),
        url,
        value,
    };

    return joke;
}

async function getJSONResponse(url) {
    const results = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
    });
    const json = await results.json();

    return json;
}
