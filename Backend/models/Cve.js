// models/Cve.js    

const mongoose = require('mongoose');

const DescriptionSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, { _id: false });

const CvssDataSchema = new mongoose.Schema({
    version: String,
    vectorString: String,
    baseScore: Number,
    accessVector: String,
    accessComplexity: String,
    authentication: String,
    confidentialityImpact: String,
    integrityImpact: String,
    availabilityImpact: String
}, { _id: false });

const CvssMetricV2Schema = new mongoose.Schema({
    source: String,
    type: String,
    cvssData: CvssDataSchema,
    baseSeverity: String,
    exploitabilityScore: Number,
    impactScore: Number,
    acInsufInfo: Boolean,
    obtainAllPrivilege: Boolean,
    obtainUserPrivilege: Boolean,
    obtainOtherPrivilege: Boolean,
    userInteractionRequired: Boolean
}, { _id: false });

const MetricsSchema = new mongoose.Schema({
    cvssMetricV2: [CvssMetricV2Schema]
}, { _id: false });

const WeaknessDescriptionSchema = new mongoose.Schema({
    lang: String,
    value: String
}, { _id: false });

const WeaknessSchema = new mongoose.Schema({
    source: String,
    type: String,
    description: [WeaknessDescriptionSchema]
}, { _id: false });

const CpeMatchSchema = new mongoose.Schema({
    vulnerable: Boolean,
    criteria: String,
    matchCriteriaId: String
}, { _id: false });

const ConfigurationNodeSchema = new mongoose.Schema({
    operator: String,
    negate: Boolean,
    cpeMatch: [CpeMatchSchema]
}, { _id: false });

const ConfigurationSchema = new mongoose.Schema({
    nodes: [ConfigurationNodeSchema]
}, { _id: false });

const ReferenceSchema = new mongoose.Schema({
    url: String,
    source: String
}, { _id: false });

const CveSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    sourceIdentifier: String,
    published: Date,
    lastModified: Date,
    vulnStatus: String,
    cveTags: [String],
    descriptions: [DescriptionSchema],
    metrics: MetricsSchema,
    weaknesses: [WeaknessSchema],
    configurations: [ConfigurationSchema],
    references: [ReferenceSchema]
}, {
    timestamps: true
});

// Create indexes for efficient querying


module.exports = mongoose.model('Cve', CveSchema);
