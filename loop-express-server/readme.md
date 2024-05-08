# Loop-express-server

## Description
Loop-express-server is a project designed to handle and analyze log data efficiently. It provides endpoints to store log data, retrieve statistics, and perform various operations related to log management.

## Features
- **Data Storage**: Log data can be submitted and stored in a MongoDB database.
- **Data Analysis**: Various endpoints are available to analyze log data, such as counting safe visits, retrieving the last 5 logs, fetching blocked logs, and more.
- **Message Handling**: Includes functionality to send and receive messages via API endpoints.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cors

## Installation
1. Clone the repository: `git clone https://github.com/your/repository.git`
2. Install dependencies: `npm install`
3. Set up environment variables by creating a `.env` file and specifying required variables like `PORT`, `MONGODB_URI`, etc.
4. Start the server: `npm start`

## Usage
- Use appropriate HTTP methods (GET, POST) to interact with the API endpoints.
- Refer to the API documentation for details on each endpoint and their expected inputs/outputs.

## API Documentation
- **GET /api/data**: Retrieves a simple message from the API.
- **POST /api/logData**: Submits log data to be stored in the database.
- **GET /api/safe-visits**: Retrieves the count of safe visits.
- **GET /api/last-5-logs**: Retrieves the last 5 log entries.
- **GET /api/blocked-logs**: Retrieves blocked log entries.
- **GET /api/monitor-logs**: Retrieves log entries for monitoring purposes.
- **GET /api/total-unique-ips**: Retrieves the total count of unique IP addresses.
- **GET /api/documents-per-country**: Retrieves the count of documents per country.
- **POST /api/insert-log**: Inserts a new log entry into the database.
- **POST /api/logMessage**: Submits log message data to be stored.
- **GET /api/total-requests**: Retrieves the total count of log messages.
- **GET /api/total-blocked-requests**: Retrieves the total count of blocked log messages.
- **POST /api/send-message**: Sends a message to the server.

## License
This project is licensed under the [MIT License](LICENSE).

## Contributing
Contributions are welcome. Please fork the repository and submit a pull request.

## Support
For any inquiries or issues, please contact [Your Name](mailto:kampiliakash154@email.com).

