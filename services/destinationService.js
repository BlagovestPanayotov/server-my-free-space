const { Types } = require('mongoose');

const Destination = require("../models/Destination");

async function getAll(name, country, offset, pageSize) {
  const nameRegexp = new RegExp(name, 'i');
  if (country) {
    return Destination.aggregate([
      {
        $match: {
          name: { $regex: nameRegexp },
          country: country,
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'likes' collection
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'comments' collection
          as: 'comments',
        },
      },
      {
        $project: {
          name: 1,
          country: 1,
          description: 1,
          img: 1,
          _ownerId: 1,
          likeCount: { $size: '$likes' },
          commentCount: { $size: '$comments' },
        },
      },
    ]);
  }
  return Destination.aggregate([
    {
      $match: {
        name: { $regex: nameRegexp },
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'likes' collection
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'comments' collection
        as: 'comments',
      },
    },
    {
      $project: {
        name: 1,
        country: 1,
        description: 1,
        img: 1,
        _ownerId: 1,
        likeCount: { $size: '$likes' },
        commentCount: { $size: '$comments' },
      },
    },
  ]);
}

async function getByUserId(userId, name, country, offset, pageSize) {
  const nameRegexp = new RegExp(name, 'i');
  const _userId = new Types.ObjectId(userId);
  if (country) {
    return Destination.aggregate([
      {
        $match: {
          _ownerId: _userId,
          name: { $regex: nameRegexp },
          country: country,
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'likes' collection
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'comments' collection
          as: 'comments',
        },
      },
      {
        $project: {
          name: 1,
          country: 1,
          description: 1,
          img: 1,
          _ownerId: 1,
          likeCount: { $size: '$likes' },
          commentCount: { $size: '$comments' },
        },
      },
    ]);
  }
  return Destination.aggregate([
    {
      $match: {
        _ownerId: _userId,
        name: { $regex: nameRegexp },
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'likes' collection
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: '_destinationId', // Assuming you have a field named 'destinationId' in the 'comments' collection
        as: 'comments',
      },
    },
    {
      $project: {
        name: 1,
        country: 1,
        description: 1,
        img: 1,
        _ownerId: 1,
        likeCount: { $size: '$likes' },
        commentCount: { $size: '$comments' },
      },
    },
  ]);
}

async function getById(id) {
  return Destination.findById(id).populate('comments').populate('likes');

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