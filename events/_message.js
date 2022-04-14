const config = require("../config.js");
let cooldown = new Set(),
  süre = 2000;
const { Permissions } = require("discord.js")

module.exports = {
  name: 'messageCreate',
  execute(message) {

    const client = message.client;
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const command = message.content.split(" ")[0].slice(config.prefix.length),
      params = message.content.split(" ").slice(1);
    let cmd;

    const yetkiler = {};
    yetkiler["BOT_OWNER"] = "Bot Sahibi";
    yetkiler["CREATE_INSTANT_INVITE"] = "Davet Oluştur";
    yetkiler["KICK_MEMBERS"] = "Üyeleri At";
    yetkiler["BAN_MEMBERS"] = "Üyeleri Engelle";
    yetkiler["ADMINISTRATOR"] = "Yönetici";
    yetkiler["MANAGE_CHANNELS"] = "Kanalları Yönet";
    yetkiler["MANAGE_GUILD"] = "Sunucuyu Yönet";
    yetkiler["ADD_REACTIONS"] = "Tepki Ekle";
    yetkiler["VIEW_AUDIT_LOG"] = "Denetim Kaydını Görüntüle";
    yetkiler["VIEW_CHANNEL"] = "Metin Kanallarını ve Ses Kanallarını Gör";
    yetkiler["SEND_MESSAGES"] = "Mesaj Gönder";
    yetkiler["SEND_TTS_MESSAGES"] = "Metin Okuma Mesajı Gönder";
    yetkiler["MANAGE_MESSAGES"] = "Mesajları Yönet";
    yetkiler["EMBED_LINKS"] = "Bağlantı Yerleştir";
    yetkiler["ATTACH_FILES"] = "Dosya Ekle";
    yetkiler["READ_MESSAGE_HISTORY"] = "Mesaj Geçmişini Oku";
    yetkiler["MENTION_EVERYONE"] = "@everyone, @here ve Rolleri Etiketleme";
    yetkiler["USE_EXTERNAL_EMOJIS"] = "Harici Emoji Kullan";
    yetkiler["CONNECT"] = "Bağlan";
    yetkiler["SPEAK"] = "Konuş";
    yetkiler["MUTE_MEMBERS"] = "Üyeleri Sustur";
    yetkiler["DEAFEN_MEMBERS"] = "Üyeleri Sağırlaştır";
    yetkiler["MOVE_MEMBERS"] = "Üyeleri Taşı";
    yetkiler["USE_VAD"] = "Ses Eylemini Kullan";
    yetkiler["PRIORITY_SPEAKER"] = "Öncelikli Konuşmacı";
    yetkiler["STREAM"] = "Yayın Yapabilme";
    yetkiler["CHANGE_NICKNAME"] = "Kullanıcı Adı Değiştir";
    yetkiler["MANAGE_NICKNAMES"] = "Kullanıcı Adlarını Yönet";
    yetkiler["MANAGE_ROLES"] = "Rolleri  Yönet";
    yetkiler["MANAGE_WEBHOOKS"] = "Webhook'ları Yönet";
    yetkiler["MANAGE_EMOJIS"] = "Emojileri Yönet";

    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
      cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
      if (cooldown.has(message.author.id)) {
        let time = Math.floor(cooldown.time - Date.now());
        message.reply(
          `Komutlarımı kullanabilmek için ${(time / 1000)
            .toString()
            .slice(0, 3)} saniye beklemelisin.`,
        );

        return;
      }

      cooldown.add(message.author.id);
      cooldown.time = Date.now() + süre;
      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, süre);

      if (!message.guild) {
        if (cmd.config.guildOnly === true) {
          return;
        }
      }
      if (cmd.config.permLevel) {
        if (cmd.config.permLevel == "BOT_OWNER") {
          if (!config.sahip.includes(message.author.id)) {
            message.
              reply(
                `Komutu kullanmak için \`${yetkiler[cmd.config.permLevel]
                }\` yetkisine ihtiyacın var`,
              )
              .then((msg) => setTimeout(() => { msg.delete() }, 3000));
            return;
          }
        } else {
          if (!message.member.permissions.has(Permissions.FLAGS[cmd.config.permLevel])) {
            message.reply(
                `Komutu kullanmak için \`${yetkiler[cmd.config.permLevel]
                }\` yetkisine ihtiyacın var`,
              )
              .then((msg) => setTimeout(() => { msg.delete() }, 3000));
            return;
          }
        }
      }
      cmd.run(client, message, params);
    }
  }
};
