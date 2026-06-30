const { json } = require('express');
const messageModel = require('../models/messageModel');
const userModel = require('../models/usermod');

exports.sendMessage = (req, res) => {
    const {toUserId, text} = req.body;
    const fromUserId = req.user.id;

    if (!toUserId || !text) {
        return json.status(400).json({error: 'не указан получатель или текст'});
    }

    const recipient = userModel.findUserByID(toUserId);
    if (!recipient) {
        return json.status(400).json({error: 'не найден получатель'});
    }

    const message = messageModel.sendMessage(fromUserId, toUserId, text);
    return res.status(201).json({message});
};

exports.getConversation = (req, res) => {
    const {userId} = req.params;
    const currentUserId = req.user.id;

    const otherUser = userModel.findUserByID(userId);
    if (!otherUser) {
        return json.status(400).json({error: 'Пользователь не найден'});
    }

    const messages = messageModel.getConversation(currentUserId, userId);
    return json({messages, user:otherUser})
};

exports.getConversationList = (req, res) => {
    const userId = req.user.id;
    const conversations = messageModel.getConversationList(usedId);

    const listOfUsers = conversations.map(conv =>{
        const user = userModel.findUserByID(conv.userId);
        return {
            ...conv,
            username: user ? user.username : 'unknown',
            avatar: user ? user.avatar : null
        };
    });
    res.json({conversations: listOfUsers});
};


exports.markAsread = (req, res) => {
    const {fromUserId} = req.body;
    const toUserId = req.user.id;
    if (!fromUserId) {
        return json.status(400).json({error: 'пользователь не указан'});
    };

    const updated = messageModel.markMessageAsRead(fromUserId, toUserId);
    res.json({succes: updated});
}
