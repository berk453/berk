const Discord = require("discord.js"),
  fs = require("fs"),
  token = require("./../../config").token,
  { inspect } = require("util"),

  path = require("path");

exports.run = async (bot, message, args) => {
  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .setDescription("Kodu düzgün kullan.")
      .setColor("RANDOM");
    message.channel.send({ embeds: [embed] });
    return;
  }

  const code = args.join(" ");
  let evaled;

  function clean(input) {
    return input
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(new RegExp(token, "gi"), "******");
  }

  try {
    evaled = await eval(`(async () => {${code}})()`);
    message.reply("```js\n" + inspect(evaled, { depth: 0 }) + "```", {
      code: "js",
      split: true,
    });
  } catch (error) {
    message.reply("```js\n" + error + "```", { code: "js", split: true });
  }
};

exports.config = {
  name: "eval",
  guildOnly: true,
  aliases: [],
  permLevel: "BOT_OWNER",
  des: "Error.",
  category: path.basename(__dirname),
};
