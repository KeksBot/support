const embeds = require('./embeds')
const fs = require('fs')
const path = require('path')
const discord = require('discord.js')
const delay = require('delay')

const validatePermissions = (command) => {
    const validPermissions = Object.keys(discord.Permissions.FLAGS)
    if(!validPermissions.includes(command.permission)) throw new Error(`Unbekannte Permission "${command.permission} bei "${command.name}"`)
}

module.exports = async (client) => {
    client.commands = new discord.Collection()
    client.cooldowns = new discord.Collection()

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
                        validatePermissions(command)
                    }
                    if(command.roles) command.defaultPermission = false
                    client.commands.set(command.name, command)
                    console.log(`[${client.user.username}]: ${command.name} wurde geladen.`)
                }

            }
        }
    }
    console.log(`[${client.user.username}]: Commands werden geladen.`)
    readCommands('./slashcommands')
    console.log(`[${client.user.username}]: Commands werden initialisiert.`)
    await client.guilds.fetch()
    var progress = 0
    var failedguilds = 0
    var end = false
    await client.guilds.cache.array().forEach(async guild => {
        try {
            let commands = await guild.commands.set(client.commands.array())
            await guild.roles.fetch()
            commands.array().forEach(async function(command) {
                if(client.commands.find(c => c.name === command.name).permission) {
                    var permissions = []
                    var length = guild.roles.cache
                        .filter(r => !r.tags || (!r.tags.botId && r.tags.integrationId))
                        .filter(r => r.permissions.has(client.commands.find(c => c.name === command.name).permission)).size
                    var counter = 0
                    var accepted = 0
                    guild.roles.cache
                        .filter(r => !r.tags || (!r.tags.botId && r.tags.integrationId))
                        .filter(r => r.permissions.has(client.commands.find(c => c.name === command.name).permission))
                        .array()
                        .forEach(async function (role) {
                            permissions.push({
                                id: role.id,
                                type: 'ROLE',
                                permission: true
                            })
                            accepted ++
                            counter ++
                            if(accepted == 10 || counter == length - 1) {
                                try {await command.permissions.add({permissions})} catch {}
                                permissions = []
                                accepted = 0
                            }
                        })
                } else if(client.commands.find(c => c.name === command.name)) {
                    var systemcommand = client.commands.find(c => c.name === command.name)
                    if(typeof systemcommand.roles === 'string') systemcommand.roles = [systemcommand.roles]
                    systemcommand.roles.forEach(name => {
                        systemcommand.roles[systemcommand.roles.indexOf(name)] = 
                            (name === 'owner') ? '779969055779061770' :
                            (name === 'mod') ? '775002147846488085' :
                            (name === 'dev') ? '779969450383507488' :
                            (name === 'sup') ? '779969700351180800' :
                            (name === 'team') ? '779991897880002561' : 
                            null
                    })
                    var roles = []
                    systemcommand.roles.forEach(r => roles.push({ 
                        id: r,
                        type: 'ROLE',
                        permission: true
                    }))
                    try {await command.permissions.set( { permissions: roles } )} catch (error) { console.error }
                }
            })
        } catch (error) {
            console.error(error)
            failedguilds++
        } finally {
            progress ++
            if(progress == client.guilds.cache.size) end = true
        }
    })
    while(!end) {await delay(500)}
    console.log(`[${client.user.username}]: Initialisierung abgeschlossen.`)
    if(failedguilds) console.log('Commands wurden auf ' + failedguilds + ' Servern NICHT geladen.')

    client.on('interactionCreate', async function(ita) {
        //Commandhandling
        if(!ita.isCommand()) return
        let command = client.commands.get(ita.commandName)
        if(!command) {
            return embeds.error(ita, 'Fehler', 'Der Befehl wurde nicht gefunden.', true, true)
        }
        var args = {}
        ita.options._hoistedOptions.forEach(option => args[option.name.replaceAll('-', '_')] = option.value)
        if(ita.options.getSubcommand(false) || false) args.subcommand = ita.options.getSubcommand(false)
        if(ita.options.getSubcommandGroup(false) || false) args.subcommandgroup = ita.options.getSubcommandGroup(false)

        //Cooldown
        const { cooldowns } = client
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new discord.Collection())
        }
        
        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 1) * 1000
    
        if(timestamps.has(ita.user.id)) {
            const expirationTime = timestamps.get(ita.user.id) + cooldownAmount
        
            if(now < expirationTime) {
                const timeLeft = Math.floor(expirationTime / 1000)
                return embeds.error(ita, 'Cooldown', `Du kannst den ${command.name} Befehl erst wieder ${timeLeft} benutzen.`, true)
            }
        }
        
        timestamps.set(ita.user.id, now)
        setTimeout(() => timestamps.delete(ita.user.id), cooldownAmount)

        //Execute
        try {
            ita.color = { red: 0xE62535, yellow: 0xF2E03F, lime: 0x25D971, normal: 0xa051ae }
            let argsarray = []
            for (const item in args) {
                argsarray.push(args[item])
            }
            let d = new Date()
            console.log(`${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${ita.user.tag} | ID: ${ita.user.id} | ${ita.guild.name} | ID: ${ita.guild.id} | ${command.name} | [ ${argsarray.join(', ')} ]`)
            await command.execute(ita, args, client)
        } catch (error) {
            console.error(error)
            return embeds.error(ita, 'Fehler', 'Beim Ausführen des Commands ist ein unbekannter Fehler aufgetreten.\nBitte probiere es später erneut.', true, true)
        }
    })
}