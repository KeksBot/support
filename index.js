const discord = require('discord.js')
const client  = new discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_MESSAGES','GUILD_PRESENCES']})
discord.Collection.prototype.array = function() {return [...this.values()]}
require('dotenv').config()
global.color = { red: 0xE62535, yellow: 0xF2E03F, lime: 0x25D971, normal: 0xa051ae }
global.status = true

var date = new Date()
console.log(`Starte System am ${date.getDate()}.${date.getMonth() +1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

client.once('ready', async () => { //Status
    var start = Date.now()
    console.log(`[${client.user.username}]: Client geladen.`)
    console.log(`[${client.user.username}]: System wird gestartet...`)
    client.setMaxListeners(0)
    await require('./commandhandler')(client)
    await require('./eventhandler')(client)
    var end = Date.now()
    console.log(`[${client.user.username}]: System aktiv.`)
    console.log(`[${client.user.username}]: Startzeit betrug ${end - start} ms.`)
})

client.login(process.env.TOKEN)