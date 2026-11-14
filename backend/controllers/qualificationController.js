const makeCrudController = require('./crudFactory');
const Model = require('../models/Qualification');
module.exports = makeCrudController(Model);
