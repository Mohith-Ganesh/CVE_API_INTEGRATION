# CVE API Integration

## BACKEND 

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
git clone <repo_url>
cd cve-api
```

## STARTING THE SERVER

```bash
    cd Backend
    node app.js
```

## CRONE TASK FOR DATA SYNC

```bash
    cd Backend
    node import_cves.js
``` 

## API DOCUMENTATION
POST /api/cves
Description: This endpoint allows you to create a new CVE record in the database.

GET /api/cves
Description: This endpoint retrieves a list of CVE records with optional filters and pagination.

sample curl:GET /api/cves?id=CVE-1999-0334&year=1999&score=10&page=1&limit=20
you can pass the filters either direct filters or indirect filters as required along with the pagination data required



## FRONTEND 

## STARTING THE FRONTEND

```bash
    cd frontend
    npm start
```


<!-- Tech Stack -->
- **Node.js**: JavaScript runtime used for development.
- **React.js**: Frontend Library for Node.js.

## Screenshots

Here are some screenshots demonstrating the application:

### Screenshot 1: [CVE List Page]
![CVE List Page](screenshots/Screenshot%202024-12-17%20184109.png)

### Screenshot 2: [CVE Details Page]
![CVE Details Page](screenshots/Screenshot%202024-12-17%20184140.png)

### Screenshot 3: [CVE List View]
![CVE List View](screenshots/Screenshot%202024-12-17%20184242.png)

### Screenshot 4: [CVE List Form]
![CVE List Form](screenshots/Screenshot%202024-12-17%20184506.png)

### Screenshot 5: [CVE Edit Form]
![CVE Edit Form](screenshots/Screenshot%202024-12-17%20184619.png)
