const asyncHandler = require("../middleware/async");
const News = require("../models/news");

// @desc    Get all news articles
// @route   GET /api/v1/news
// @access  Public
exports.getNews = asyncHandler(async (req, res, next) => {
    try {
        const news = await News.find();
        res.status(200).json({ success: true, count: news.length, data: news });
    } catch (error) {
        next(error);
    }
});

// @desc    Get a single news article
// @route   GET /api/v1/news/:id
// @access  Public
exports.getSingleNews = asyncHandler(async (req, res, next) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: "News article not found" });
        }
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
});

// @desc    Create a news article
// @route   POST /api/v1/news
// @access  Private (Admin only)
exports.createNews = asyncHandler(async (req, res, next) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
});

// @desc    Update a news article
// @route   PUT /api/v1/news/:id
// @access  Private (Admin only)
exports.updateNews = asyncHandler(async (req, res, next) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!news) {
            return res.status(404).json({ success: false, message: "News article not found" });
        }

        res.status(200).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a news article
// @route   DELETE /api/v1/news/:id
// @access  Private (Admin only)
exports.deleteNews = asyncHandler(async (req, res, next) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);

        if (!news) {
            return res.status(404).json({ success: false, message: "News article not found" });
        }

        res.status(200).json({ success: true, message: "News deleted successfully" });
    } catch (error) {
        next(error);
    }
});
