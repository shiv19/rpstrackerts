export function handleErrors(response) {
    if (!response.ok) {
        const responseObj = response.json();
        if (!responseObj.error) {
            responseObj.error = 'Something went wrong!';
        }

        return responseObj;
    }

    return response.json();
}
