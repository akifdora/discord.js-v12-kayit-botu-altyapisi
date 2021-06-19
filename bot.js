const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
require("moment-duration-format");
const Jimp = require("jimp");
const db = require("quick.db");
var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

// BOT İÇERİĞİ - BAŞLANGIÇ //

// BOTUN ALTYAZISI //
client.on("ready", () => {
  // Eğer botunuzun bir ses kanalında görünmesini istiyorsanız alttaki satırın başındaki ve sonundaki // işaretlerini silin
  client.channels.cache.get("855554326767468588").join(); //
  var altyazı = [
    `Instagram: @benakifdora`,
	  `Twitter: @akifdora`,
    `TikTok: @akifdora`,
    `Youtube: Akif DORA`,
    `Twitch: akifdora`
  ];
  setInterval(function() {
    var random = Math.floor(Math.random() * altyazı.length);
    client.user.setActivity(altyazı[random], { type: 'WATCHING' });
    }, 2 * 3500);

})
// BOTUN ALTYAZISI //

// BOTUN BULUNDUĞU SES KANALINI SORGULAMA //
  client.on("voiceStateUpdate", function(olds, news){
    if(olds.channel && !news.channel && news.member.user.id === client.user.id) olds.channel.join()
  })
// BOTUN BULUNDUĞU SES KANALINI SORGULAMA //

// GELEN GİDEN //
client.on(`guildMemberAdd`, async member => {
  var gelen = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("📥 • YENİ BİR ÜYEMİZ VAR!")
  .setThumbnail(member.user.avatarURL({display: true}))
  .setDescription(`${member.user} sunucuya katıldı, şu an sunucumuzda ${member.guild.memberCount} üye var!`)
  client.channels.cache.get("855557191959576607").send(gelen)
});

client.on(`guildMemberRemove`, async member => {
  var giden = new Discord.MessageEmbed()
  .setColor("RED")
  .setTitle("📤 • BİR ÜYE SUNUCUDAN AYRILDI!")
  .setThumbnail(member.user.avatarURL({display: true}))
  .setDescription(`${member.user} sunucudan ayrıldı, şu an sunucumuzda ${member.guild.memberCount} üye var!`)
  client.channels.cache.get("855557191959576607").send(giden)
});
// GELEN GİDEN //

// KAYIT GİRİŞ //
client.on('guildMemberAdd', async member => {
  db.add(`${member.guild.id}_${member.id}_girmismi`, 1)

  member.roles.add(("855900979325435934"));
  let kanal = "855554326767468587";
  let teyityetkili = "855901019522727958";
  let sunucuismi = "A k i f  D O R A  -  Y o u t u b e"
  let cmfzaman = new Date().getTime() - member.user.createdAt.getTime();
  let cmfzaman2 = new Date().getTime() - member.user.createdAt.getTime();
  let girmismi = db.fetch(`${member.guild.id}_${member.id}_girmismi`)

  var guvenlik = [];
    if(cmfzaman > 604800000) {
      guvenlik = "✅ Güvenli";
      } else {
      guvenlik = "❌ Güvenilir Değil";
    }

    if(girmismi > 1){
      giriskontrol = "❌ Daha önce sunucuya katılmış!"
    } else {
      giriskontrol = "✅ Sunucuya ilk kez katıldı!"
    }


  const gecen = moment.duration(cmfzaman2).format(` Y **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 

  const embed = new Discord.MessageEmbed()
  .setTitle(sunucuismi)
  .setThumbnail(member.user.displayAvatarURL({dynamic : true}))
  .setDescription(`💎 ${member} sunucumuza hoşgeldin!
  
  📊 Seninle birlikte \`${member.guild.memberCount}\` kişi olduk! Ses teyit odalarına geçerek kayıt olabilirsin.
  
  📆 **Hesap Açılış Tarihi**
  \`${gecen}\``)
  .addFields(
    { name: "Güvenlik", value: guvenlik, inline: true },
    { name: "Kontrol", value: giriskontrol, inline: true }
  )
  client.channels.cache.get(kanal).send(`<@&${teyityetkili}> • ${member}`, embed)
})
// KAYIT GİRİŞ //



// BOT İÇERİĞİ - SON //


// ALTYAPI DOKUNMA! //
require("./util/eventLoader")(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} Adet Komut Yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen Komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);