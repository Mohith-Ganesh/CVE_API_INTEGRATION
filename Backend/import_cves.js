require('dotenv').config(); 
const axios = require('axios');
const mongoose = require('mongoose');
const async = require('async');
const Cve = require('./models/Cve'); 
const cliProgress = require('cli-progress');


const {
  MONGODB_URI,
  NVD_API_BASE_URL,
  RESULTS_PER_PAGE = 200, 
  DELAY_MS = 5000,        
  CONCURRENCY = 5          
} = process.env;

// Assign MONGO_URI from MONGODB_URI
const MONGO_URI = MONGODB_URI;

// Validate Environment Variables
if (!MONGO_URI || !NVD_API_BASE_URL) {
  console.error('❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

// Initialize Progress Bar
const progressBar = new cliProgress.SingleBar({
  format: 'Progress |{bar}| {percentage}% || {value}/{total} CVEs Imported',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function fetchCveData(startIndex, resultsPerPage) {
  try {
    const response = await axios.get(NVD_API_BASE_URL, {
      params: {
        startIndex,
        resultsPerPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching CVE data at startIndex ${startIndex}:`, error.message);
    throw error; 
  }
}


async function createCve(cveData, callback) {
  try {
    const existingCve = await Cve.findOne({ id: cveData.id });
    if (existingCve) {
      // Update the entire document with new data
      Object.assign(existingCve, cveData);
      await existingCve.save();
      console.log(`🔄 CVE ${cveData.id} updated.`);
    } else {
      // Insert as a new document
      const cve = new Cve(cveData);
      await cve.save();
      console.log(`✅ CVE ${cveData.id} inserted.`);
    }
     // Indicate successful processing
  } catch (error) {
    console.error(`❌ Error processing CVE ${cveData.id}:`, error.message);
    callback(error); // Pass error to async queue
  }
}

// Main function to orchestrate the import process
async function importCvesData() {
  await connectToMongoDB();

  try {
    let totalResults = 0;
    let startIndex = 0;

    // Initial API call to get totalResults
    const initialData = await fetchCveData(startIndex, 1); // Fetching 1 record to get totalResults
    totalResults = initialData.totalResults;
    console.log(`📊 Total CVEs to import: ${totalResults}`);

    // Initialize Progress Bar
    progressBar.start(totalResults, 0);

    // Create an async queue with concurrency control
    const queue = async.queue(createCve, CONCURRENCY);

    // Handle queue drain event (optional)
    queue.drain(() => {
      // This will be called when the last item from the queue has returned from the worker
      // No action needed here for this script
    });

    while (startIndex < totalResults) {
      console.log(`\n🔄 Fetching CVEs from index ${startIndex} to ${startIndex + parseInt(RESULTS_PER_PAGE)}...`);
      const data = await fetchCveData(startIndex, RESULTS_PER_PAGE);
      const vulnerabilities = data.vulnerabilities;

      if (!vulnerabilities || vulnerabilities.length === 0) {
        console.log('📭 No more CVE data to import.');
        break;
      }

      // Process each CVE in the current batch
      for (const vuln of vulnerabilities) {
        const cve = vuln.cve;
        const formattedCve = {
          id: cve.id, // Assign to 'id' field
          sourceIdentifier: cve.sourceIdentifier,
          published: cve.published,
          lastModified: cve.lastModified,
          vulnStatus: cve.vulnStatus,
          cveTags: cve.cveTags,
          descriptions: cve.descriptions,
          metrics: cve.metrics,
          weaknesses: cve.weaknesses,
          configurations: cve.configurations,
          references: cve.references.map(ref => ({
            url: ref.url,
            source: ref.source
          })),
        };

        queue.push(formattedCve, (err) => {
          if (err) {
            // Errors are already logged in createCve function
          } else {
            // Increment progress bar on successful insertion or update
            progressBar.increment();
          }
        });
      }

      // Wait for the queue to drain before proceeding to the next batch
      await queue.drain();

      // Update startIndex for the next batch
      startIndex += parseInt(RESULTS_PER_PAGE);

      // Introduce a delay before fetching the next batch
      console.log(`\n⏳ Waiting for ${DELAY_MS / 1000} seconds before fetching the next batch...`);
      await delay(DELAY_MS);
    }

    progressBar.stop();
    console.log('\n🎉 CVE Data Import Completed Successfully!');
  } catch (error) {
    progressBar.stop();
    console.error('❌ An error occurred during the import process:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('🔒 MongoDB connection closed.');
  }
}

// Run the import function
importCvesData();
