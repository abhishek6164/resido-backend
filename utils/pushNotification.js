const sendPushNotification = async (tokens, title, body) => {
    const messages = tokens.map(token => ({
        to: token,
        sound: "default",
        title,
        body,
        data: {
            type: "GATE_ALERT"
        }
    }));

    try {
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(messages)
        });
        console.log("✅ Notifications sent!");
    } catch (error) {
        console.error("Push notification error:", error.message);
    }
};

module.exports = {
    sendPushNotification
};