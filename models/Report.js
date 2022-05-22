const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportID: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    cause: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    vehicle: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,

    },
    decision: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "denied"]
    }
}, { timestamps: true });

const ReportModel = mongoose.model('Report', reportSchema)

module.exports = ReportModel