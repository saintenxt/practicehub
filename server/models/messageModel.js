const fs = require('fs');
const { MESSAGE_FILES} = require('../config/constants');

function readMessages() {
    const data = fs.readFileSync(MESSAGE_FILES, 'utf-8');
    return JSON.parse(data);
};

function writeMessages(messages) {
    fs.writeFileSync(MESSAGE_FILES, JSON.stringify(messages, null, 2), 'utf-8');
};

function sendMessage(fromUserId, toUserId, text) {
    const message = readMessages();
    const newMessage = {
        id: Date.now().toString(),
        fromUserId,
        toUserId,
        text,
        createdAt: new Date.toISOString(),
        read: false
    }
    message.push(newMessage);
    writeMessages(message);
    return newMessage;
};

function getConversation(userId1, userId2) {
    const messages = readMessages();
    return messages.filter(
    msg =>
        (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
        (msg.fromUserId === userId2 && msg.toUserId === userId1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

function getConversationList(userId) {
    const messages = readMessages();
    const newIds = new Set();
    messages.forEach(message =>{
        if (message.fromUserId === userId) newIds.add(message);
        if (message.toUserId === userId) newIds.add(message);
    });

    const result = [];
    userIds.forEach(uid => {
    const msgs = messages.filter(
        m => (m.fromUserId === userId && m.toUserId === uid) || (m.fromUserId === uid && m.toUserId === userId)
    );
    const lastMsg = msgs.reduce((latest, current) =>
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    );
    result.push({
        userId: uid,
        lastMessage: lastMsg.text,
        lastMessageDate: lastMsg.createdAt,
        unreadCount: messages.filter(m => m.fromUserId === uid && m.toUserId === userId && !m.read).length
    });
    });

    result.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
    return result;
};


function markMessageAsRead(fromUserId, toUserId) {
    const messages = readMessages();
    let updated = false;
    const newMessages = messages.map(message => {
        if (msg.fromUserId === fromUserId && msg.toUserId === toUserId && !msg.read) {
            updated = true;
        return { ...msg, read: true };
        }
        return message;
    });
    if (updated) writeMessages(newMessages);
    return updated;
};

module.exports = {
    sendMessage,
    getConversation,
    getConversationList,
    markMessageAsRead
};