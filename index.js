const { Client, Intents, Collection, MessageEmbed } = require("discord.js"), fs = require("fs"),
    bot = new Client({
        partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING]
    });

fs.readdir("./events/", (err, eventFiles) => {
    if (err) console.log(err);
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) bot.once(event.name, (...args) => event.execute(...args, bot));
        else bot.on(event.name, (...args) => event.execute(...args, bot));
    }
});

fs.readdir("./commands/", (err, categories) => {
    bot.commands = new Collection();
    bot.aliases = new Collection();
    if (err) console.log(err);
    console.log(`Toplam ${categories.length} kategori bulundu.`);
    categories.forEach((category) => {
        fs.readdir(`./commands/${category}`, (err, files) => {
            console.log(`${category} kategorisinde ${files.length} komut bulundu.`);
            if (err) console.log(err);
            files.forEach((file) => {
                if (!file.endsWith(".js")) return;
                const prop = require(`./commands/${category}/${file}`);
                bot.commands.set(prop.config.name, prop);
                prop.config.aliases.forEach((alias) => {
                    bot.aliases.set(alias, prop.config.name);
                });
            });
        });
    });
});

const config = require("./config");

const { joinVoiceChannel } = require('@discordjs/voice');
bot.on("ready", () => {
    const guildID = "844846398629609483";
    const channelID = "846865053918691339";
    const channel = bot.channels.cache.get(channelID);
    const guild = bot.guilds.cache.get(guildID);

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });
    setInterval(() => {
        connection.rejoin();
    }, 10_000);
})

const emoji = "🍎";
const rolid = "847073103657304094";
bot.on("message", async (message) => {
    if (message.content == (config.prefix + "emojikayıt aç")) {
        const channelG = message.guild.channels.cache.find(a => a.name == "emoji-kayıt");
        if (channelG) {

            message.channel.send("Zaten emoji kayıt kanalı bulunuyor. <#" + channelG + ">");

            return;
        }

        const channel = await message.guild.channels.create("emoji-kayıt", {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    allow: ["VIEW_CHANNEL"],
                    deny: ["SEND_MESSAGES", "CONNECT"]
                }
            ],
        })
        const embed = new MessageEmbed().setDescription("Tıkla kayıt ol!").setColor("RANDOM");
        channel.send({ embeds: [embed] }).then(async msg => {
            await msg.react(emoji);
        })
    }
});

bot.on("messageReactionAdd", (reaction, user) => {
    if (user.bot) return;
    if (reaction.emoji.name == emoji) {
        reaction.message.guild.members.cache.get(user.id).roles.add(rolid);
    }

})

bot.login(require("./config.js").token);