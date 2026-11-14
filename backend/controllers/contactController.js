const makeCrudController = require('./crudFactory');
const Model = require('../models/Contact');
module.exports = makeCrudController(Model);
