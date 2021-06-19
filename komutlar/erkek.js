const Discord = require('discord.js')
const db = require('quick.db')
const ayarlar = require('../ayarlar.json');
require("../inlinereply");

    exports.run = async(client, message, args) => {
        if(!message.member.roles.cache.has('855901019522727958')){
            const hata = new Discord.MessageEmbed()
            .setDescription(`❌ • Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`)
            .setColor('#ff0000')
            return message.inlineReply(hata).then(msg => msg.delete({timeout: 5000}));
        }

        // Let tanımlarımız
        let kullanıcı = message.mentions.members.first();
        let isim = args[1];
        let yas = args[2];

        // Hata mesajlarımız
        if(!kullanıcı){
            const hata = new Discord.MessageEmbed()
            .setDescription(`❌ • Lütfen kayıt etmek istediğin kişiyi etiketle!`)
            .setColor('#ff0000')
            return message.inlineReply(hata).then(msg => msg.delete({timeout: 5000}));
        }
        if(!isim){
            const hata = new Discord.MessageEmbed()
            .setDescription(`❌ • Lütfen kayıt etmek istediğin kişinin ismini gir!`)
            .setColor('#ff0000')
            return message.inlineReply(hata).then(msg => msg.delete({timeout: 5000}));
        }
        if(!yas){
            const hata = new Discord.MessageEmbed()
            .setDescription(`❌ • Lütfen kayıt etmek istediğin kişinin yaşını gir!`)
            .setColor('#ff0000')
            return message.inlineReply(hata).then(msg => msg.delete({timeout: 5000}));
        }
        function buyukHarf(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        

        if(kullanıcı && isim && yas){
            kullanıcı.roles.remove(['855900979325435934'])
            kullanıcı.setNickname(buyukHarf(isim) + " | " + yas)
            kullanıcı.roles.add(['855901417470820372'])

            const basarili = new Discord.MessageEmbed()
            .setTitle("✅ • KAYIT BAŞARILI")
            .setThumbnail(message.mentions.users.first().avatarURL({ dynamic: true }))
            .addFields(
                { name: "Kullanıcı", value: kullanıcı, inline: true },
                { name: "Yetkili", value: message.author, inline: true },
                { name: "Verilen Rol", value: "<@&855901417470820372>", inline: true }
            )
            .setColor('GREEN')
            message.inlineReply(basarili)
                    // Data
        db.get(`erkekkayit_${message.author.id}_${message.guild.id}`)
        db.add(`erkekkayit_${message.author.id}_${message.guild.id}`, +1)

        let member = message.mentions.users.first()

        client.channels.cache.get("855554326767468587").send(`${member}`).then(msg => msg.delete({timeout: 3000}));
        }
    }

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['e'],
    permLevel: 0
}

exports.help = {
    name: 'erkek'
}