const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
let queue = [];
let isPlaying = false;

module.exports = {
    name: 'play',
    description: 'Clear selection',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        let servers = {};
        //queue.push(0);
        //console.log(queue);
        if (!voiceChannel) { return message.channel.send('Please enter a voice channel to execute play command.'); }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) { return message.channel.send(`You don't have permissions to connect.`); }
        if (!permissions.has('SPEAK')) { return message.channel.send(`You don't have permissions to speak.`); }

        if (!args.length) { return message.channel.send('You need to send the a link/name for a song'); }
        //new-
        if (!servers[message.guild.id]) {
            servers[message.guild.id] = { queue: [] }
        }

        let server = servers[message.guild.id];

        //checks that the url input is valid
        let validURL = ytdl.validateURL(args[0]);

        function play(connection, stream){
            isPlaying = true;
            connection.play(stream, { seek: 0, volume: 1})
            .on('start', ()=>{
                message.reply(`:thumbsup: Now Playing Your Song`);
            })
            .on('finish', async () => {
               
                let nextLink = queue.shift();
                console.log('--- Beginning next song ---' , nextLink);
                if(nextLink){
                    let stream = ytdl(nextLink, { filter: 'audioonly' });
                    play(connection, stream);
                }else{
                    isPlaying = false;
                }
                //await message.reply(`:thumbsup: Now Playing Your Song`);
            })
        }
        //plays the validURL
        if (validURL) {
            message.channel.send('Valid url, thanks.');
            const connection = await voiceChannel.join();
            
            let currentLink = args[0];
            //shift to get first in queue
            if(isPlaying === true){
                queue.push(currentLink);
                console.log(queue);
                message.channel.send('Added to queue position ', queue.indexOf(currentLink) );
            }
            else{
                queue.push(currentLink);
                if(queue){
                    let stream = ytdl(currentLink, { filter: 'audioonly' });
                    play(connection, stream);
                }
        }
            return;
        }
    }
}