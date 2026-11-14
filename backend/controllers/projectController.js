const makeCrudController = require('./crudFactory');
const Model = require('../models/Project');
module.exports = makeCrudController(Model);
