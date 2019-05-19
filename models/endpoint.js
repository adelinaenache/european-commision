const mongoose = require('mongoose');

const endpointSchema = new mongoose.Schema({
    serviceName: String,
    title: String,
    description: String,
    url: String,
    tags: [String],
});

const Endpoint = mongoose.model('Endpoint', endpointSchema);
module.exports = Endpoint;