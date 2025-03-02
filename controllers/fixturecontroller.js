import Fixture from '../models/fixture.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a fixture'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newFixture = new Fixture({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedFixture = await newFixture.save();
    res.status(201).json(savedFixture);
  } catch (error) {
    next(error);
  }
};

export const getfixtures = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Fixture.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.FixtureId && { _id: req.query.FixtureId }),
      ...(req.query.searchTerm && {
        $or: [
          { team_2: { $regex: req.query.searchTerm, $options: 'i' } },
          { team_1: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalFixtures = await Fixture.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthFixtures = await Fixture.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalFixtures,
      lastMonthFixtures,
    });
  } catch (error) {
    next(error);
  }
};

export const deletefixture = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this fixture'));
  }
  try {
    await Fixture.findByIdAndDelete(req.params.postId);
    res.status(200).json('The fixture has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatefixture = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this fixture'));
  }
  try {
    const updatedFixture = await Post.findByIdAndUpdate(
      req.params.fixtureId,
      {
        $set: {
          team_2: req.body.team_2,
          team_1: req.body.team_1,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedFixture);
  } catch (error) {
    next(error);
  }
};
