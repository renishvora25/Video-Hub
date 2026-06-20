import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid channel ID" 
        });
    }

    if (channelId.toString() === req.user._id.toString()) {
        return res.status(400).json({ 
            success: false, 
            message: "You cannot subscribe to your own channel" 
        });
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        
        return res.status(200).json({
            success: true,
            data: { isSubscribed: false },
            message: "Unsubscribed successfully"
        });
    } else {
        const newSubscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        });

        return res.status(200).json({
            success: true,
            data: { isSubscribed: true },
            message: "Subscribed successfully"
        });
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid channel ID" 
        });
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "fullName username avatar");

    return res.status(200).json({
        success: true,
        data: subscribers,
        message: "Subscribers fetched successfully"
    });
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid subscriber ID" 
        });
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "fullName username avatar");

    return res.status(200).json({
        success: true,
        data: subscribedChannels,
        message: "Subscribed channels fetched successfully"
    });
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}