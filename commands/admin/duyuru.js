const Discord = require("discord.js"), path = require("path");
exports.run = async (bot, message, args) => {

    const content = args.slice(1).join(" ");
    const kanal = message.mentions.channels.first();

    if (!kanal) return message.channel.send("Kanal etiketlemeniz gerekiyor.");

    if (content.length == 0) return message.channel.send("Mesajı belirtmeniz gerekiyor.");

    const embed = new Discord.MessageEmbed().setDescription("**Duyuru**\n\n"+content).setColor("RANDOM").setTimestamp(Date.now());
    kanal.send({ content: "@everyone", embeds: [embed] })
};

exports.config = {
    name: "duyuru",
    guildOnly: true,
    aliases: [],
    permLevel: "",
    des: "",
    category: path.basename(__dirname),
};

