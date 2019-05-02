const express = require('express');
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client();
const jsonfile = require('jsonfile');
const prefix = "!";

client.on('message', async message => {
  if(message.content == `${prefix}avatar`) {
    let embed = new Discord.RichEmbed()
    .setTitle(message.author.tag)
    .setImage(message.author.avatarURL.split("?size=2048").join("?size=256"))
    .setColor("#000000")
    message.channel.send(embed)
  }
  
  if(message.content.startsWith(`${prefix}avatar `)) {
    let mention = message.mentions.users.first();
    let embed = new Discord.RichEmbed()
    .setTitle(mention.tag)
    .setImage(mention.avatarURL.split("?size=2048").join("?size=256"))
    .setColor("#000000")
    message.channel.send(embed)
  }
  
  if(message.content.startsWith(`${prefix}dm`)) {
    let messageToSend = message.content.slice(`${prefix}dm `.length) // slices off how long this string is
    message.author.send(messageToSend)
  }
  
  if(message.content.startsWith(`${prefix}custom`)) {
     if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply("fuck off")
     let commandName = message.content.split(" ")[1] 
     let responseType = message.content.split(" ")[2]
     let commandResponse = message.content.slice(`${prefix}custom ${commandName} ${responseType} `.length)
     
     let commands = jsonfile.readFileSync("commands.json")
     
     commands[commandName] = responseType + "|" + commandResponse
    
     jsonfile.writeFileSync("commands.json", commands)
    
     message.channel.send("Created.")
  }
  
  if(message.content.startsWith(prefix)) {
    if(jsonfile.readFileSync("commands.json")[message.content.slice(`${prefix}`.length)]) {
      let commands = jsonfile.readFileSync("commands.json")[message.content.slice(`${prefix}`.length)]
      let responseType = commands.split("|")[0]
      message[responseType].send(commands.split("|")[1])
    }
  }
  
  if(message.content == prefix + "commands") {
  message.channel.send("Commands are being sent your way!")
    message.author.send(`**__The Commands for the Server.__**

1️⃣?suggest :point_right: Use this Command in the #Dyno Channel. This Command allow's you to post a suggestion inside the #Suggestions Channel. (Usage: ?suggest (suggestion)


2️⃣?say :point_right: Use this Command in any Channel. To get DynoBot to say whatever you want! (Usage: ?say (whatever you want.)


3️⃣?report :point_right: Use this Command in #Dyno Channel.This Command will Report someone who's being an asshole in the #lets-taco-bout-it Channel. Only use this Command if there are no Moderators Online. (Usage: ?report (user) [Reason] - You don't have to ping the User to Report them.)

4️⃣?maintenance :point_right: Use this Command if you detect any "Server Issues." This Command Direct Messages the current "Server Maintenance" Member. Telling them the Issue and whom Detected it.


__Command Credits__:
- **Freddy Krueger**

:star:This concludes the Servers Commands!:star:`) 
  }
});

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

client.login(process.env.TOKEN) // gimmie token