const http = require('http');
const url = require('url');

// Function to remove special characters from a string
function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9]/g, ''); // This will keep only alphanumeric characters
}

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    // Handle POST requests to /bfhl
    if (req.method === 'POST' && reqUrl.pathname === '/bfhl') {
        let requestBody = '';

        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', () => {
            try {
                const requestData = JSON.parse(requestBody);

                // Extract 'data' from the request body
                const data = requestData.data || [];

                // Your user data
                const full_name = "Harshit_Gupta";
                const date_of_birth = "08092000";
                const college_email = "harshitgupta.2020@vitbhopal.ac.in";
                const college_roll_number = "20BCE10617";


                // Filter numbers and alphabets
                const numbers = [];
                const alphabets = [];

                for (const item of data) {
                    // Remove special characters and trim
                    const cleanedItem = removeSpecialCharacters(item).trim();

                    if (!isNaN(cleanedItem)) {
                        numbers.push(cleanedItem);
                    } else if (cleanedItem.length === 1) {
                        alphabets.push(cleanedItem);
                    }
                }

                // Sort numbers
                numbers.sort((a, b) => parseFloat(a) - parseFloat(b));

                // Sort alphabets (case-insensitive)
                alphabets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

                // Find the highest alphabet
                const highest_alphabet = alphabets.length > 0 ? alphabets[alphabets.length - 1] : '';

                // Generate user_id
                const user_id = `${full_name}_${date_of_birth}`;

                // Prepare the response JSON for POST request
                const response = {
                    is_success: true,
                    user_id: user_id,
                    email: college_email,
                    roll_number: college_roll_number,
                    numbers: numbers,
                    alphabets: alphabets,
                    highest_alphabet: [highest_alphabet]
                };

                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(response));
            } catch (error) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    is_success: false,
                    error_message: error.message
                }));
            }
        });
    } else if (req.method === 'GET' && reqUrl.pathname === '/bfhl') {
        // Handle GET requests to /bfhl
        const response = {
            operation_code: 1
        };

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(response));
    } else {
        // Handle other requests
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('Not Found');
    }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
