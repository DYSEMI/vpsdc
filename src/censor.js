const { Message, User, MessageEmbed } = require("discord.js");

module.exports = (client) => {
    client.on("message", async message => {
        let blacklisted = ['csicska', 'köcsög', 'kocsog',
         'buzi', 'geci', 'fasz', 'vibrator', 'anyád', 'szop', 'kur','dagadék', 'dagadek', 'cigany',
          'cigány', 'szar', 'szar', 'b+', 'gec', 'anal', 'baszon', 'isten', 'Isten', 'kabbe' ]
        let bot_commands = [
            '/', '!', '*', '_'
        ]
        let ido = new Date();

        //974729743075274753 - dc parancsok chat ID  
        // kefudio id : 535189980503343114
        let botprefix;
        let x = client.channels.cache.find(channel => channel.id === "983803092376117248")
        
        if (client) {
            if (message.channel.id != "974729743075274753") {
                for (const q in bot_commands) {
                    botprefix = message.content.includes(bot_commands[q]);
                    if (botprefix) {
                        const { member, guild, channel } = message
                        message.delete()
                        let rang = member.guild.roles.cache.find(role => role.name === 'Muted')
                        console.log(`kitiltásban részsült :${message.author.tag} ezért: nem megfelő helyen parancsolt!`)
                       // client.channels.cache.find(channel => channel.id === "983803092376117248").send(`${message.author.tag} Kilett tiltva! ezért: nem megfelő helyen parancsolt!`)
                        member.roles.add(rang)
                        setTimeout(() => {
                           member.roles.remove(rang)
                           console.log(`kitiltása lejárt: ${message.author.tag} `)
                         //  client.channels.cache.find(channel => channel.id === "983803092376117248").send(`${message.author.tag} Eltíltás lejárt!`)
                        }, 900000);
                        
                    }
                }
                //console.log("ez nem a bot parancsok ")
            }else{
               // console.log(`${message.author.tag} írt egy szöveges csatornában!`);
            }
            //console.log( message.channel.id)
        }
        
        
        
          
        let foundInText = false;
        
        for (var i in blacklisted){
            let found = message.content.includes(blacklisted[i]); 
            if (found) {
                foundInText = true;
                console.log("nem oda illő szót talaltam: "+message.content);
            }
        }

        const { member, guild, channel } = message
        if (foundInText) {
            const user = message.mentions.users.first() 
            


///
            const role = member.guild.roles.cache.find(role => role.name === 'Muted')
            message.delete()
            member.roles.add(role)
            //message.channel.send('Máskor vigyázz mit írsz! (1 percig némitva lettél)')
            client.channels.cache.find(channel => channel.id === "983803092376117248").send(`${message.author.tag} Kilett tiltva! ezért: csúny szó!`)
            setTimeout(() => {
                // message.channel.send('hoppááááá!')
                member.roles.remove(role)
                //message.channel.send(`${message.author.tag} Az eltíltásod lejárt!`)
                client.channels.cache.find(channel => channel.id === "983803092376117248").send(`${message.author.tag} Eltíltás lejárt!`)
            }, 60000);

        }
    })
}