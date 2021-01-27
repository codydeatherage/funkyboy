const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'play',
    description: 'Clear selection',
    async execute(message,args){
        const voiceChannel = message.member.voice.channel;
        //new
        let servers = {};
        let isPlaying = false;
        // const queue = message.client.queue;
        // const serverQueue = message.client.queue.get(message.guild.id); ------------

        if(!voiceChannel){ return message.channel.send('Please enter a voice channel to execute play command.'); }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')  ){ return message.channel.send(`You don't have permissions to connect.`); }
        if(!permissions.has('SPEAK') ){ return message.channel.send(`You don't have permissions to speak.`); }

        if(!args.length){ return message.channel.send('You need to send the a link/name for a song'); }
        //new-
        if(!servers[message.guild.id]){ 
            servers[message.guild.id] = { queue: [] }
        }

        let server = servers[message.guild.id];
        server.queue.push(args[1]);
        console.log(server.queue + ' at first');

        function play(connection, message){
            let server = servers[message.guild.id];
            const stream = ytdl(video.url, {filter: 'audioonly'});
            server.dispatcher = connection.play(stream, {seek: 0, volume: 1})
            let isPlaying = true;
            server.queue.shift();
            console.log(`AT 2ND: ${server.queue}`);
            server.dispatcher.on('finish', () => {
                if(server.queue[0] && !isPlaying){
                    play(connection, message)
                } else{
                    voiceChannel.leave();
                }
               
            });
        }//--------------------------------------------


        //checks that the url input is valid
        let validURL = ytdl.validateURL(args[0]);

        //plays the validURL
        if(validURL){
            console.log('Good with me!');
            message.channel.send('Valid url, thanks.');
            const connection = await voiceChannel.join();
            
            const stream = ytdl(args[0], {filter: 'audioonly'});
            //console.log(ytdl(args[0]));
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () => {
                voiceChannel.leave();
                message.channel.send('Leaving channel..');
            });
            await message.reply(`:thumbsup: Now Playing Your Song`);
            return;
        }

        //will execute when input is song name/keywords
        // const connection = await voiceChannel.join();
        // const videoFinder = async(query) => {
        //     const videoResult = await ytSearch(query);
        //     return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;   
        // }
        // const video = await videoFinder(args.join(' '));
        // if(video){
        //     const stream = ytdl(video.url, {filter:'audioonly'});
        //     connection.play(stream, {seek: 0, volume: 1})
        //     .on('finish', () => {
        //         voiceChannel.leave();
        //     });

        //     await message.reply(`:thumbsup: Now Playing **${video.title}**`)
        // } else{
        //     message.channel.send('No video results found');
        // }


        //Working on implementation with queue rather than a single song at a time
        //keyword yt search
        const connection = await voiceChannel.join();
        const videoFinder = async(query) => {
            const videoResult = await ytSearch(query);
            return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;   
        }
        const video = await videoFinder(args.join(' '));
        if(video){
           play(connection, message);
            await message.reply(`:thumbsup: Now Playing **${video.title}**`)
        } else{
            message.channel.send('No video results found');
        }



    }
}