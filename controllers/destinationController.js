const destinationController = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { hasUser } = require('../middlewares/guards');
const { getAll, create, getById, update, deleteById, getByUserId, getRandom } = require('../services/destinationService');
const errorParser = require('../utils/errorParser');


destinationController.get('/destinations', async (req, res) => {
  try {

    console.log('>>> GET /dest/destinations');

    const { name, country, offset, pageSize } = req.query;

    const destinations = await getAll(name.trim(), country.trim(), offset.trim(), pageSize.trim());

    res.json(destinations);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

destinationController.get('/my-destination/', hasUser(), async (req, res) => {
  try {

    console.log('>>> GET /dest/my-destination');

    const userId = req.user._id;
    const { name, country, offset, pageSize } = req.query;

    const destinations = await getByUserId(userId, name, country, offset, pageSize);

    res.json(destinations);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

destinationController.post('/destinations', hasUser(), upload.single('fileInput'), async (req, res) => {
  console.log('>>> POST /dest/destinations');

  try {

    console.log(req.file);
    res.end();

    // const dest = await create(req.body.name, req.body.country, req.body.description, req.body.img, req.user._id);
    // res.json(dest);
  } catch (err) {
    console.log(err);
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

destinationController.get('/random', async (req, res) => {
  const dests = await getRandom();

  res.json(dests);
});

destinationController.get('/:id', async (req, res) => {
  console.log(`>>> GET /dest/${req.params.id}`);


  try {
    const dest = await getById(req.params.id);
    res.json(dest);
  } catch (err) {
    console.log(err);
    const error = errorParser(err);
    res.status(404).json({ error });
  }
});

destinationController.put('/:id', hasUser(), async (req, res) => {
  console.log(`>>> PUT /dest/${req.params.id}`);

  const current = await getById(req.params.id);
  if (req.user._id != current._ownerId) {
    return res.status(403).json({ message: 'You cannot modify this destination!' });
  }
  try {
    const dest = await update(req.params.id, req.body);
    res.json(dest);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

destinationController.delete('/:id', hasUser(), async (req, res) => {
  console.log(`>>> DELETE /dest/${req.params.id}`);

  const dest = await getById(req.params.id);
  if (req.user._id != dest._ownerId) {
    return res.status(403).json({ message: 'You cannot delete this destination!' });
  }
  try {
    await deleteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});



module.exports = destinationController;