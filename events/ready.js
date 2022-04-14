
module.exports = {
    name: 'ready',
    execute: (bot) => {
        bot.user.setPresence({
            status: "online",
        });
    }
};
