import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    const videoStats = await Video.aggregate([
        { 
            $match: { owner: new mongoose.Types.ObjectId(userId) } 
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    const userVideos = await Video.find({ owner: userId }).select("_id");
    const videoIds = userVideos.map(video => video._id);

    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    const stats = {
        totalSubscribers,
        totalVideos: videoStats.length > 0 ? videoStats[0].totalVideos : 0,
        totalViews: videoStats.length > 0 ? videoStats[0].totalViews : 0,
        totalLikes
    };

    return res.status(200).json({
        success: true,
        data: stats,
        message: "Channel stats fetched successfully"
    });
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 });

    if (!videos) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch channel videos"
        });
    }

    return res.status(200).json({
        success: true,
        data: videos,
        message: "Channel videos fetched successfully"
    });
})

export {
    getChannelStats, 
    getChannelVideos
}