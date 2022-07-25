const { executionAsyncResource } = require('async_hooks');
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
 
const { YTSearcher } = require('ytsearcher');
 
const searcher = new YTSearcher({
    key: "AIzaSyCagZQ5Qc6o5PRIvmvbnXnkPks-tT_LCGA",
    revealed: true
});
const censor = require('./src/censor')
const client = new Discord.Client();
 

const queue = new Map();
   

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    censor(client)
})




client.on("message", async(message) => {
/*
    const channel = message.channel
    const members = channel.members
    if (message.content.startsWith("!kuss")) {
        await members.forEach(member => {
             member.voice.setMute(true)
             member.voice.setDeaf(false)
        });
        await message.channel.send('Mindenki Kusba lett :D');
    } else if (message.content.startsWith("!nemkuss")) {
        await members.forEach(member => {
             member.voice.setMute(false)
             member.voice.setDeaf(false)
        });
        await message.channel.send('mindeki kikussolva!');
    }
*/
    //-----------------------
    
    const botinteraction = client.channels.cache.find(channel => channel.id === "983803092376117248");

    const prefix = '!';
 
    const serverQueue = queue.get(message.guild.id);
 
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase();


    switch(command){
        case 'play':
            execute(message, serverQueue);
            try {
                console.log(`${message.author.tag} csapott egy zenét!`)
                botinteraction.send(`${message.author.tag} csapott egy zenét!`)
            } catch (error) {
                console.log(error)
            }
            
            break;
        case 'stop':
            stop(message, serverQueue);
            try{
                botinteraction.send(`${message.author.tag} lealitotta a bulit (!stop)`)
                console.log(`Zenélésnek Vége! ${message.author.tag} lealitotta a bulit (!stop)`)
            } catch (error) {
                console.log(error)
            }
            break;
        case 'skip':
            skip(message, serverQueue);
            try{
                botinteraction.send(`${message.author.tag} skip-elt eggyet (!skip)`)
                console.log(`Rossz volt a zenész biztos :D ${message.author.tag} skip-elt eggyet (!skip)`)
            } catch (error) {
                console.log(error)
            }
            break;
    }
 
    async function execute(message, serverQueue){
        let vc = message.member.voice.channel;
        if(!vc){
            return message.channel.send(" és mégis hova csatlakozzak?? Kérlek lépj be egy hang csatornára!");
        }else{
            let result = await searcher.search(args.join(" "), { type: "video" })
            const songInfo = await ytdl.getInfo(result.first.url)
 
            let song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };
 
            if(!serverQueue){
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true
                };
                queue.set(message.guild.id, queueConstructor);
 
                queueConstructor.songs.push(song);
 
                try{
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                }catch (err){
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(`Hiba! ${err}`)
                }
            }else{
                serverQueue.songs.push(song);
                return message.channel.send(`Várjál egyszerre csak 1 et tudok, majd ez után csapom! ${song.url}`);
            }
        }
    }
    function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () =>{
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            serverQueue.txtChannel.send(`Háttér zaj leszál zene indul: ${serverQueue.songs[0].url}`)
    }
    function stop (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("Báttya elször lépj be a valahová!")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
    function skip (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("Ha beléptél valahová majd szolj!");
        if(!serverQueue)
            return message.channel.send("Ezt nem lehet Skippelni!");
        serverQueue.connection.dispatcher.end();
    }
})

console.log("</>");

client.login("OTc1Mzk4MTE0OTg0ODg2Mjkz.GZQ8Wl.3LoeRCRng93z0kN6AkOPuniBXW5hr0n0duOeGA");