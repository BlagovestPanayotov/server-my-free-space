const { hasUser } = require('../middlewares/guards');
const { getAll, create, getById, update, deleteById, getByUserId, getRandom } = require('../services/destinationService');
const errorParser = require('../utils/errorParser');

const destinationController = require('express').Router();

destinationController.get('/destinations', async (req, res) => {
  let destinations;

  if (req.query.where) {
    console.log('>>> GET /dest/destinations with user');

    //TO DO -get the reaql id
    const userId = '64f0e8ec4ec379100ab92849';

    destinations = await getByUserId(userId);

  } else {
    console.log('>>> GET /dest/destinations');

    console.log(req.query);

    destinations = await getAll();
  }


  res.json(destinations);
});

destinationController.post('/destinations', hasUser(), async (req, res) => {
  console.log('>>> POST /dest/destinations');

  try {
    const dest = await create(req.body.name, req.body.country, req.body.description, req.body.img, req.user._id);
    res.json(dest);
  } catch (err) {
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
    const error = errorParser(err);
    res.status(404).json({ error });
  }
});

destinationController.put('/:id', hasUser(), async (req, res) => {
  console.log(`>>> PUT /dest/${req.params.id}`);

  const dest = await getById(req.params.id);
  if (req.user._id != dest._ownerId) {
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
    return res.status(403).json({ message: 'You cannot modify this destination!' });
  }
  try {
    const dest = await deleteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});



module.exports = destinationController;