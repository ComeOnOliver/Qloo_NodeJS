# Qloo_Api_Test
### Express.js API Application Documentation

## Overview
This Express.js application fetches data from an external API and provides various endpoints for data retrieval and processing. It includes error handling and logging middleware for better maintainability and debugging.

## Setup and Configuration

### Environment Variables
- `EXTERNAL_API_URL`: The URL of the external API from which the data is fetched.
- `PORT`: You May Customize Your own exported Port
- `API_KEY`: (Optional) You may Add other API's api key
### Starting the Application
Run the application using the command:
```bash
npm i

node server.js
```

## API Endpoints
1. Fetch Specific Data (/fetch-data)
Fetches specific data from the external API based on the provided id.

`URL: /fetch-data`\
Method: GET\
URL Params:
id=[integer] (required): The ID of the data to fetch.

2. Fetch All Data (/fetch-all)
Fetches all available data from the external API.

`URL: /fetch-all`\
Method: GET

3. Fetch Data Excluding Specific IDs (/fetch-data-exclude)
Fetches data from the external API, excluding data with specified IDs.

`URL: /fetch-data-exclude`\
Method: GET\
URL Params:
ids=[string] (required): A comma-separated list of IDs to exclude.

4. Create a random hashed UUID for each post (/transform-data)

`URL: /transform-data`
Method: GET\

## Error Handling
The application includes error handling for:

1. Missing or invalid query parameters.
2. Issues during data fetching from the external API.
3. Internal server errors.