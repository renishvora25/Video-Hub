import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid video ID"
        });
    }

    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner.fullName": 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        },
        {
            $sort: { createdAt: -1 } 
        }
    ];

    const commentAggregate = Comment.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const comments = await Comment.aggregatePaginate(commentAggregate, options);

    return res.status(200).json({
        success: true,
        data: comments,
        message: "Comments fetched successfully"
    });
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid video ID"
        });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Comment content is required"
        });
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    if (!comment) {
        return res.status(500).json({
            success: false,
            message: "Failed to add comment"
        });
    }

    return res.status(201).json({
        success: true,
        data: comment,
        message: "Comment added successfully"
    });
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid comment ID"
        });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Comment content is required"
        });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: "Comment not found"
        });
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to edit this comment"
        });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: { content }
        },
        { new: true }
    );

    return res.status(200).json({
        success: true,
        data: updatedComment,
        message: "Comment updated successfully"
    });
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid comment ID"
        });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: "Comment not found"
        });
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to delete this comment"
        });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
        success: true,
        data: {},
        message: "Comment deleted successfully"
    });
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}