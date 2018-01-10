// Timout handler
export function Timeout() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({
                statusCode: 408,
                message: "Unable to reach our server, Please try again"
            });
        }, 60000); // Timeout occurs after 60 seconds
    });
}

// Error handler
export function handleErrors(response) {
    if (!response.ok) {
        const responseObj = response.json();
        if (!responseObj.error) {
            responseObj.error = "Something went wrong!";
        }

        return responseObj;
    }

    return response.json();
}
