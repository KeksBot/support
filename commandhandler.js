const embeds = require('./embeds')
const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const delay = require('delay')

const getcolors = require('./getcolor')
const getData = require('./db/getData')
const update = require('./db/update')

module.exports = async (client) => {
    client.commands = new Discord.Collection()
    client.cooldowns = new Discord.Collection()

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else {
                if(file.endsWith('.js') && !file.startsWith('subcmd' || 'subcommand')) {
                    var command = require(path.join(__dirname, dir, file))
                    if(command.permission) {
                        command.defaultPermission = false
                        command.permission = command.permission.toUpperCase()
                    }
                    if(command.roles) command.defaultPermission = false
                    client.commands.set(command.name, command)
                    console.log(`[${client.user.username}]: ${command.name} wurde geladen.`)
                }

            }
        }
    }
    console.log(`[${client.user.username}]: Commands werden geladen...`)
    readCommands('./slashcommands')
    console.log(`[${client.user.username}]: Commands werden initialisiert.`)
    await client.guilds.fetch()
    var progress = 0
    var failedguilds = 0
    var end = false
    for (const guild of client.guilds.cache.array()) {
        try {
            await guild.commands.set(client.commands.filter(c => !c.global).array())
        } catch (error) {
            console.error(error)
            console.log(`[${client.user.username}]: Server nicht geladen: ${guild.id} | ${guild.name} | ${guild.ownerId}`)
            failedguilds++
        } finally {
            progress ++
            if(progress == client.guilds.cache.size) end = true
        }
    }
    console.log(`[${client.user.username}]: Initialisierung abgeschlossen.`)
    if(failedguilds) console.log('Commands wurden auf ' + failedguilds + ' Servern NICHT geladen.')

    client.on('interactionCreate', async function(interaction) {
        //Commandhandling
        if(interaction.type != Discord.InteractionType.ApplicationCommand) return
        let command = client.commands.get(interaction.commandName)
        if(!command) {
            return embeds.error(interaction, 'Fehler', 'Der Befehl wurde nicht gefunden.', true, true)
        }
        var args = {}
        interaction.options._hoistedOptions.forEach(option => args[option.name.replaceAll('-', '_')] = option.value)
        if(interaction.options.getSubcommand(false) || false) args.subcommand = interaction.options.getSubcommand(false)
        if(interaction.options.getSubcommandGroup(false) || false) args.subcommandgroup = interaction.options.getSubcommandGroup(false)

        //Daten laden
        var status = {user: false, server: false}
        getData('serverdata', interaction.guild.id).then(async function(data) {
            if(!data) data = await require('./db/create')('serverdata', interaction.guild.id)
            interaction.guild.data = data
            interaction.color = await getcolors(interaction.guild)
            status.server = true
        })
        getData('userdata', interaction.user.id).then(async function(data) {
            if(!data) data = await require('./db/create')('userdata', interaction.user.id)
            interaction.user.data = data
            status.user = true
        })

        //Commandhandling
        let cancel = setTimeout(function(status) {
            if(!status.user) status.user = -1
            if(!status.server) status.server = -1
        }, 10000)
        while(!status.user && !status.server) {await delay(50)}
        clearTimeout(cancel)
        if(!interaction.guild.available) return
        if(interaction.user.data == -2) return
        if(interaction.user.data == -1 || interaction.guild.data == -1) return embeds.error(interaction, 'Fehler', 'Timeout der beim Laden erforderlichen Daten. Bitte probiere es später erneut.', true).catch()

        //Cooldown
        const { cooldowns } = client
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }
        
        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 1) * 1000
    
        if(timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
        
            if(now < expirationTime) {
                const timeLeft = Math.floor(expirationTime / 1000)
                return embeds.error(interaction, 'Cooldown', `Du kannst den ${command.name} Befehl erst wieder ${timeLeft} benutzen.`, true)
            }
        }
        
        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

        //Execute
        try {
            let argsarray = []
            for (const item in args) {
                argsarray.push(args[item])
            }
            let d = new Date()
            console.log(`${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${interaction.user.tag} | ID: ${interaction.user.id} | ${interaction.guild.name} | ID: ${interaction.guild.id} | ${command.name} | [ ${argsarray.join(', ')} ]`)
            await command.execute(interaction, args, client)
        } catch (error) {
            console.error(error)
            return embeds.error(interaction, 'Fehler', 'Beim Ausführen des Commands ist ein unbekannter Fehler aufgetreten.\nBitte probiere es später erneut.', true, true)
        }
    })
}