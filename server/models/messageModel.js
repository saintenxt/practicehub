const fs = require('fs');
const { MESSAGES_FILE } = require('../config/constants');

function readMessages() {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeMessages(messages) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

function sendMessage(fromUserId, toUserId, text) {
    const messages = readMessages();
    const newMessage = {
        id: Date.now().toString(),
        fromUserId: String(fromUserId),
        toUserId: String(toUserId),
        text,
        createdAt: new Date().toISOString(),
        read: false
    };
    messages.push(newMessage);
    writeMessages(messages);
    return newMessage;
}

function getConversation(userId1, userId2) {
    const messages = readMessages();
    const firstId = String(userId1);
    const secondId = String(userId2);
    return messages.filter(
        msg =>
            (String(msg.fromUserId) === firstId && String(msg.toUserId) === secondId) ||
            (String(msg.fromUserId) === secondId && String(msg.toUserId) === firstId)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getConversationList(userId) {
    const messages = readMessages();
    const currentUserId = String(userId);
    const userIds = new Set();

    messages.forEach(message => {
        if (String(message.fromUserId) === currentUserId) userIds.add(String(message.toUserId));
        if (String(message.toUserId) === currentUserId) userIds.add(String(message.fromUserId));
    });

    const result = [];
    userIds.forEach(uid => {
        const msgs = messages.filter(
            m =>
                (String(m.fromUserId) === currentUserId && String(m.toUserId) === uid) ||
                (String(m.fromUserId) === uid && String(m.toUserId) === currentUserId)
        );
        const lastMsg = msgs.reduce((latest, current) =>
            new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        );
        result.push({
            userId: uid,
            lastMessage: lastMsg.text,
            lastMessageDate: lastMsg.createdAt,
            unreadCount: messages.filter(
                m => String(m.fromUserId) === uid && String(m.toUserId) === currentUserId && !m.read
            ).length
        });
    });

    result.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
    return result;
}


function markMessageAsRead(fromUserId, toUserId) {
    const messages = readMessages();
    const senderId = String(fromUserId);
    const recipientId = String(toUserId);
    let updated = false;
    const newMessages = messages.map(message => {
        if (String(message.fromUserId) === senderId && String(message.toUserId) === recipientId && !message.read) {
            updated = true;
            return { ...message, read: true };
        }
        return message;
    });
    if (updated) writeMessages(newMessages);
    return updated;
}

module.exports = {
    sendMessage,
    getConversation,
    getConversationList,
    markMessageAsRead
};
