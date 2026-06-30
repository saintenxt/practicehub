const fs = require('fs');
const {NOTIFICATION_FILES} = require('../config/constants');

function readNotification() {
    const data = fs.readFileSync(NOTIFICATION_FILES, 'utf-8');
    return JSON.parse(data);
};


function writeNotification(notifications) {
    fs.writeFileSync(NOTIFICATION_FILES, JSON.stringify(notifications, null, 2));
};

function sendNotification(fromUserId, toUserId) {
    const notification = readNotification();
    const newNotification = {
        id: Date.now().toString(),
        fromUserId,
        toUserId,
        createdAt: new Date.toString(),
        read: false
    };
    notification.push(newNotification);
    writeNotification(notification);
    return newNotification;
};

function markNotificationAsRead (fromUserId, toUserId) {
    const notification = readNotification();
    let updated = false;
    const newNotification = notification.map({
        
    })
    
}