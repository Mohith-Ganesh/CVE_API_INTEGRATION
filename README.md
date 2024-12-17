# CVE API Integration

<!-- Overview -->
This project is a backend service built with Node.js and Express.js to manage and process CVE (Common Vulnerabilities and Exposures) data. The service pulls CVE data from an external source, stores it in a MongoDB database, and exposes RESTful API endpoints for querying and interacting with the CVE data. It also includes a cron job that runs every two days to fetch and update CVE records.

<!-- Tech Stack -->
- **Node.js**: JavaScript runtime used for backend development.
- **Express.js**: Web framework for Node.js to create RESTful APIs.
- **MongoDB**: NoSQL database for storing CVE data.
- **Mongoose**: MongoDB Object Data Modeling (ODM) library for Node.js.
- **Axios**: Promise-based HTTP client used for fetching CVE data from an external API.
- **node-cron**: A cron job scheduler for running periodic tasks (fetch CVE data every 2 days).
- **dotenv**: Loads environment variables from a `.env` file.
- **Nodemon**: Development tool that automatically restarts the server when file changes are detected.

<!-- Features -->
- **API to Create, Update, and Fetch CVEs**: CRUD operations for CVE data.
- **Filter CVEs by ID, Year, Score, and Last Modified**: Query CVE data with various filters.
- **Pagination**: Fetch paginated CVE results with configurable page size and page number.
- **Automatic Data Import (Cron Job)**: Runs every 2 days to fetch CVE data from an external source and stores it in the database.

## Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/yourusername/cve-api.git
cd cve-api

2. **Start the server**:
```bash
git clone https://github.com/yourusername/cve-api.git
cd cve-api
