const discord = require('discord.js')
const client  = new discord.Client({ intents: ['Guilds', 'GuildBans', 'GuildMembers', 'GuildInvites', 'GuildEmojisAndStickers', 'GuildMessages', 'GeuildMessageReactions', 'GuildVoiceStates', 'DirectMessages', 'DirectMessageReactions'] })
const config  = require('./config.json')
discord.Collection.prototype.array = function() {return [...this.values()]}

var date = new Date()
console.log(`Starte System am ${date.getDate()}.${date.getMonth() +1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

client.once('ready', async () => { //Status
    client.user.setStatus('idle')
    client.restarting = 0
    var start = Date.now()
    console.log(`[${client.user.username}]: Client geladen.`)
    console.log(`[${client.user.username}]: System wird gestartet...`)
    client.setMaxListeners(0)
    let mongoose = await require('./db/database')()
    console.log(`[${client.user.username}]: Verbindung zur Datenbank hergestellt`)
    mongoose.connection.close()
    await require('./commandhandler')(client)
    await require('./eventhandler')(client)
    await require('./buttonhandler.js')(client)
    var end = Date.now()
    console.log(`[${client.user.username}]: System aktiv.`)
    console.log(`[${client.user.username}]: Startzeit betrug ${end - start} ms.`)
    client.user.setStatus('online')
})

client.login(config.token)