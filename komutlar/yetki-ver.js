const Discord = require('discord.js');
const doradb = require("quick.db")
const moment = require('moment');
const ayarlar = require('../ayarlar.json');

exports.run = async (client, message, args) => {
  var gün = [moment().format('DD.MM.YYYY | H:mm:ss')]
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!message.member.roles.cache.has("855901055992332308"))
return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • Bu komutu kullanabilmek için <@&855901055992332308> olmalısın!`)).then(msg => msg.delete({timeout: 5000}));
if (!member) return message.channel.send(new Discord.MessageEmbed().setDescription('❌ • Kime rol vereceğim etiketlesene o_O')).then(msg => msg.delete({timeout: 5000}));
  if (message.member.roles.highest.comparePositionTo("855901019522727958") < 1) {
  return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • Verilecek rol senin rolünün altında olmalı akıllı bıdık seni :)`)).then(msg => msg.delete({timeout: 5000}));
  }

  try{
await (member.roles.add(["855901019522727958"]))
 doradb.set(`Yetkili.${member.id}`, gün)
 message.channel.send(new Discord.MessageEmbed().setDescription(`✅ • ${member} isimli üyeye <@&855901019522727958> isimli yetki başarıyla verildi!`)  .setFooter(message.author.tag, message.author.avatarURL({dynamic: true})).setColor('#D2EE07')).then(msg => msg.delete({timeout: 5000}));
    
  } catch (e) {
    console.log(e);
    message.channel.send('❌ • Hata oluştu!').then(msg => msg.delete({timeout: 5000}));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yetki-ver', "yv", "yetkiver"],
  permLevel: 0
};

exports.help = {
  name: 'yetki',
  description: 'Belirttiğiniz kullanıcıya belirttiğiniz rolü verir.',
  usage: 'yetki'
};