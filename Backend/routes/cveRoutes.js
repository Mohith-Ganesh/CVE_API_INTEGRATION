// routes/cveRoutes.js

const express = require('express');
const router = express.Router();
const Cve = require('../models/Cve');

const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date;
};

router.get('/', async (req, res) => {
    try {
        const { id, year, score, lastModifiedDays, page = 1, limit = 20 } = req.query;
        let query = {};

        if (id) {
            query.id = id;
        }

        if (year) {
            const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
            const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
            query.published = { $gte: startDate, $lte: endDate };
        }

        if (score) {
            const scoreFloat = parseFloat(score);
            if (!isNaN(scoreFloat)) {
                query.$or = [
                    { 'metrics.cvssMetricV2.cvssData.baseScore': scoreFloat },
                    { 'metrics.cvssMetricV3.cvssData.baseScore': scoreFloat }
                ];
            }
        }

        if (lastModifiedDays) {
            const nDays = parseInt(lastModifiedDays);
            if (!isNaN(nDays)) {
                const dateNDaysAgo = getDateNDaysAgo(nDays);
                query.lastModified = { $gte: dateNDaysAgo };
            }
        }

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const cves = await Cve.find(query)
            .skip(skip)
            .limit(limitNumber)
            .exec();

        const total = await Cve.countDocuments(query).exec();
        const totalPages = Math.ceil(total / limitNumber);

        res.status(200).json({
            total,
            page: pageNumber,
            pages: totalPages,
            limit: limitNumber,
            data: cves
        });
    } catch (error) {
        console.error('Error fetching CVEs:', error);
        res.status(500).json({ error: 'Server error while fetching CVEs.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, sourceIdentifier, published, lastModified, vulnStatus, cveTags, descriptions, metrics, weaknesses, configurations, references } = req.body;
        if (!id || !sourceIdentifier || !published || !lastModified || !vulnStatus) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        let existingCve = await Cve.findOne({ id });
        if (existingCve) {
            return res.status(400).json({ error: 'CVE with this ID already exists.' });
        }
        const newCve = new Cve({
            id,
            sourceIdentifier,
            published,
            lastModified,
            vulnStatus,
            cveTags,
            descriptions,
            metrics,
            weaknesses,
            configurations,
            references
        });
        const savedCve = await newCve.save();
        res.status(201).json(savedCve);
    } catch (error) {
        console.error('Error creating CVE:', error);
        res.status(500).json({ error: 'Server error while creating CVE.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const cveId = req.params.id;
        const updateData = req.body;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No data provided for update.' });
        }
        const updatedCve = await Cve.findOneAndUpdate({ id: cveId }, updateData, { new: true, runValidators: true });
        if (!updatedCve) {
            return res.status(404).json({ error: 'CVE not found.' });
        }
        res.status(200).json(updatedCve);
    } catch (error) {
        console.error('Error updating CVE:', error);
        res.status(500).json({ error: 'Server error while updating CVE.' });
    }
});

module.exports = router;
