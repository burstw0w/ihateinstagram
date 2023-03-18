const { Client, IntentsBitField} = require('discord.js');
const instagramGetUrl = require("instagram-url-direct")

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.login("insert token here");

client.on('ready', (c) =>{
    console.log('Bot radi')
});

client.on('messageCreate', (msg) => {
  if (msg.author.bot){
    return; 
  };

  handleInstagramUrl(msg);
});

async function handleInstagramUrl(msg) {
  let check = msg.content.match(/\bhttps?:\/\/(www\.)?instagram\.com\S+/gi);
  if (check) {
    let links = await instagramGetUrl(check[0]);

    var TinyURL = require('tinyurl');
    
    TinyURL.shorten(links.url_list[0], function(res, err) {
      if (err)
        console.log(err)
	    //console.log(res);
      msg.reply(res);
    });
  }
  
}