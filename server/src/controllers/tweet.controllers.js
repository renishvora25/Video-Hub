import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({ 
            success: false, 
            message: "Tweet content is required" 
        });
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    if (!tweet) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to create tweet please try again" 
        });
    }

    return res.status(201).json({
        success: true,
        data: tweet,
        message: "Tweet created successfully"
    });
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid user ID" 
        });
    }

    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 })
        .populate("owner", "fullName username avatar");

    return res.status(200).json({
        success: true,
        data: tweets,
        message: "User tweets fetched successfully"
    });
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid tweet ID" 
        });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({ 
            success: false, 
            message: "Tweet content is required" 
        });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        return res.status(404).json({ 
            success: false, 
            message: "Tweet not found" 
        });
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
            success: false, 
            message: "You do not have permission to edit this tweet" 
        });
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: { content }
        },
        { new: true }
    );

    return res.status(200).json({
        success: true,
        data: updatedTweet,
        message: "Tweet updated successfully"
    });
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid tweet ID" 
        });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        return res.status(404).json({ 
            success: false, 
            message: "Tweet not found" 
        });
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
            success: false, 
            message: "You do not have permission to delete this tweet" 
        });
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json({
        success: true,
        data: {},
        message: "Tweet deleted successfully"
    });
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}