const Destination = require("../models/Destination");

async function getAll() {
  return Destination.find({});
}

async function getByUserId(userId) {
  return Destination.find({ _ownerId: userId });
}

async function getById(id) {
  return Destination.findById(id);

}

async function create(name, country, description, img, _ownerId) {
  return Destination.create({
    name,
    country,
    description,
    img,
    _ownerId
  });
}

async function update(id, dest) {
  const existing = await Destination.findById(id);
  existing.name = dest.name;
  existing.country = dest.country;
  existing.description = dest.description;
  existing.img = dest.img;

  return existing.save();
}

async function deleteById(id) {
  return Destination.findOneAndDelete(id);
}

async function getRandom() {
  try {
    const count = await Destination.count({});
    const random1 = Math.floor(Math.random() * count);
    const random2 = Math.floor(Math.random() * count);
    return Promise.all([
      Destination.findOne().limit(1).skip(random1),
      Destination.findOne().limit(1).skip(random2),
    ]);

  } catch (err) {
    console.log(err);
  }

}

module.exports = {
  getAll,
  getByUserId,
  getById,
  create,
  update,
  deleteById,
  getRandom,
};