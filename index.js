const Discord = require('discord.js');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const auth = require('./auth.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cmdFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of cmdFiles) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(auth.prefix)) return;
    
    // const args = message.content.slice(prefix.length).trim().split(/ +/);
    // const cmd = args.shift().toLowerCase();

    // if(cmd === 'clear'){
    //     client.commands.get('clear').execute(message, args);
    // } else if(cmd === 'play'){
    //     client.commands.get('play').execute(message, args);
    // } else if(cmd === 'stop'){
    //     client.commands.get('stop').execute(message, args);
    // }
    const args = message.content.slice(auth.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const cmd = client.commands.get(cmdName);

    try{
        cmd.execute(message,args)
    } catch(err){
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }



})

client.login(auth.token);