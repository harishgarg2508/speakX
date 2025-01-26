const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const readline = require('readline');

const PROTO_PATH = path.join(__dirname, '../proto/search.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const SearchService = grpc.loadPackageDefinition(packageDefinition).search.SearchService;
const client = new SearchService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getSearchSuggestions(query) {
    return new Promise((resolve, reject) => {
        client.getSearchSuggestions({ 
            query,
            limit: 55
        }, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response.results);
            }
        });
    });
}

async function interactiveSearch() {
    console.log("Enter search term (press Ctrl+C to exit):");
    
    rl.on('line', async (input) => {
        if (input.length > 0) {
            try {
                const results = await getSearchSuggestions(input);
                console.log('Search Results:', JSON.stringify(results, null, 2));
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    });

    rl.on('close', () => {
        process.exit(0);
    });
}

interactiveSearch();