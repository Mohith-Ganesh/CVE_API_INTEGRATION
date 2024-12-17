const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import your Express app
const Cve = require('../models/Cve');
require('dotenv').config();

// Mock Database URI
const mongoTestUri=process.env;

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(mongoTestUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up: Disconnect and drop the test database
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all data before each test
  await Cve.deleteMany({});
});

describe('CVE Routes API Tests', () => {
  // Test data
  const testCve = {
    id: 'CVE-1999-0334',
    sourceIdentifier: 'cve@mitre.org',
    published: '1998-09-30T22:30:00.000Z',
    lastModified: '2024-11-20T17:57:50.607Z',
    vulnStatus: 'Modified',
    cveTags: [],
    descriptions: [{ lang: 'en', value: 'Test CVE description' }],
    metrics: {
      cvssMetricV2: [
        {
          cvssData: {
            version: '2.0',
            baseScore: 7.2,
            vectorString: 'AV:L/AC:L/Au:N/C:C/I:C/A:C',
            accessVector: 'LOCAL',
            accessComplexity: 'LOW',
            authentication: 'NONE',
            confidentialityImpact: 'COMPLETE',
            integrityImpact: 'COMPLETE',
            availabilityImpact: 'COMPLETE',
          },
        },
      ],
    },
    configurations: [],
    references: [{ url: 'http://example.com', source: 'source_example' }],
  };

  // TEST: POST /api/cves
  it('should create a new CVE record', async () => {
    const res = await request(app).post('/api/cves').send(testCve);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(testCve.id);
    expect(res.body.sourceIdentifier).toBe(testCve.sourceIdentifier);
  });

  // TEST: POST /api/cves - Duplicate Entry
  it('should not create a duplicate CVE record', async () => {
    await new Cve(testCve).save(); // Insert one record
    const res = await request(app).post('/api/cves').send(testCve);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('CVE with this ID already exists.');
  });

  // TEST: GET /api/cves
  it('should fetch all CVE records with pagination', async () => {
    await new Cve(testCve).save(); // Insert test record
    const res = await request(app).get('/api/cves?page=1&limit=10');
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe(testCve.id);
  });

  // TEST: GET /api/cves with filters
  it('should fetch CVE records filtered by ID', async () => {
    await new Cve(testCve).save();
    const res = await request(app).get(`/api/cves?id=${testCve.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].id).toBe(testCve.id);
  });

  // TEST: PUT /api/cves/:id
  it('should update an existing CVE record', async () => {
    await new Cve(testCve).save();
    const updatedData = { vulnStatus: 'Updated' };
    const res = await request(app).put(`/api/cves/${testCve.id}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.vulnStatus).toBe('Updated');
  });

  // TEST: PUT /api/cves/:id - Non-existent CVE
  it('should return 404 when updating a non-existent CVE record', async () => {
    const res = await request(app).put('/api/cves/CVE-0000-0000').send({ vulnStatus: 'New' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('CVE not found.');
  });
});
