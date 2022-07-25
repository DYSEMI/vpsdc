import DiscordJS, { Intents, Interaction} from 'discord.js'
import dotenv from 'dotenv'

const censor = require('./src/censor')

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('bot is ONLINE....')
    censor(client)
    const guildID = '974701095354003487'
    const guild = client.guilds.cache.get(guildID)
    let commands

    if (guild) {
        commands = guild.commands
    }else{
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: 'Replies width pong.',
    })

    commands?.create({
        name: 'add',
        description: 'Összead 2 számot (pl: 25 + 50 = 70)',
        options: [
            {
                name: 'num1',
                description: 'add meg az első számot',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'num2',
                description: 'add meg a második számot',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })

    //Lol rúnák
    commands?.create({
        name: 'darius',
        description: 'Darius  run :',
        
    })

})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options } = interaction

    if (commandName == 'ping') {
        interaction.reply({
            content: 'pong',
            ephemeral: true,
        })

    }else if (commandName == 'add'){
        const num1 = options.getNumber('num1')!
        const num2 = options.getNumber('num2')!

        interaction.reply({
            content: "a 2 szám összege: " + (num1 + num2)
        })//

    }else if (commandName == 'darius'){
        interaction.reply({
            content: "Még nem aktív!"
        })

    }
    
})
/*
client.on('messageCreate', (massage) =>{
    if (massage.content === 'csicska') {
        massage.reply({
            content: 'anyád a csicska te faszszopó ....',
        })
    }
})*/

/*client.on('messageCreate', (massage) =>{
    if (massage.content === 'alatvaloim') {
        massage.reply({
            content: '@FlamoDog',
        })
    }
})*/

/*
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.lenght).split(/ +/);
    


})
*/

client.login(process.env.TOKEN)

