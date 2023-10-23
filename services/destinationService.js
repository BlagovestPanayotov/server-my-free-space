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
          from: 'likedestinations',
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
          img: '$img.thumbUrl',
          _ownerId: 1,
          likeCount: { $size: '$likes' },
          commentCount: { $size: '$comments' },
        },
      }
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
        from: 'likedestinations',
        localField: '_id',
        foreignField: '_destinationId',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: '_destinationId',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_ownerId',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
    {
      $project: {
        name: 1,
        country: 1,
        description: 1,
        img: '$img.thumbUrl',
        _ownerId: 1,
        likeCount: { $size: '$likes' },
        commentCount: { $size: '$comments' },
        ownerInfo: {
          thumbUrl: '$owner.image.thumbUrl',
          gender: '$owner.gender',
          accountName: '$owner.accountName',
        }
      },
    }
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
          img: '$img.thumbUrl',
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
        img: '$img.thumbUrl',
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

async function create(name, country, description, imgUrl, thumbUrl, _ownerId) {
  return Destination.create({
    name,
    country,
    description,
    img: {
      imgUrl,
      thumbUrl
    },
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
  return Destination.findOneAndDelete({ _id: id });
}

async function getRandom() {
  try {
    const count = await Destination.count({});
    const random1 = Math.floor(Math.random() * count);
    const random2 = Math.floor(Math.random() * count);
    const [one, two] = await Promise.all([
      Destination.aggregate([
        { $skip: random1 },
        { $limit: 1 },
        {
          $lookup: {
            from: 'likedestinations',
            localField: '_id',
            foreignField: '_destinationId',
            as: 'likes',
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: '_destinationId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $unwind: '$owner',
        },
        {
          $project: {
            name: 1,
            country: 1,
            description: 1,
            img: '$img.thumbUrl',
            _ownerId: 1,
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            ownerInfo: {
              thumbUrl: '$owner.image.thumbUrl',
              gender: '$owner.gender',
              accountName: '$owner.accountName',
            }
          },
        }
      ]),
      Destination.aggregate([
        { $skip: random2 },
        { $limit: 1 },
        {
          $lookup: {
            from: 'likedestinations',
            localField: '_id',
            foreignField: '_destinationId',
            as: 'likes',
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: '_destinationId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $unwind: '$owner',
        },
        {
          $project: {
            name: 1,
            country: 1,
            description: 1,
            img: '$img.thumbUrl',
            _ownerId: 1,
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            ownerInfo: {
              thumbUrl: '$owner.image.thumbUrl',
              gender: '$owner.gender',
              accountName: '$owner.accountName',
            }
          },
        }
      ]),
    ]);
    return [one[0], two[0]];
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