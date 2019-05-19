const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
    serviceName: String,
    description: String,
    url: String,
    contact: String,
});

const Service = mongoose.model('Service', servicesSchema);
module.exports = Service;