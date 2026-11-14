const asyncHandler = require('../middleware/asyncHandler');
function makeCrudController(Model) {
  return {
    getAll: asyncHandler(async (_req, res) => res.json(await Model.find().sort({ _id: -1 }))),
    getById: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      return doc ? res.json(doc) : res.status(404).json({ error: 'Not found' });
    }),
    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    }),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body,
        { new: true, runValidators: true });
      return doc ? res.json(doc) : res.status(404).json({ error: 'Not found' });
    }),
    deleteById: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      return doc ? res.json({ message: 'Deleted', id: req.params.id })
        : res.status(404).json({ error: 'Not found' });
    }),
    deleteAll: asyncHandler(async (_req, res) => {
      const result = await Model.deleteMany({});
      res.json({ message: 'Deleted all', deletedCount: result.deletedCount });
    })
  };
}
module.exports = makeCrudController;
