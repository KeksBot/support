const discord = require('discord.js')
const https = require('https')

module.exports = {
    name: 'main',
    event: 'ready',
    async on(client) {
        const channel = await client.channels.fetch('793544692770799636')
        await channel.messages.fetch()
        var message = (channel.lastMessage?.editable) ?
            channel.lastMessage :
            await channel.send('System wird gestartet...')
        var keksbot = await (await client.guilds.fetch('775001585541185546')).members.fetch('774885703929561089')
        //:Hug: für Alpi :3

        //Status überprüfen
        if(message.embeds && message.embeds[0]?.color == global.color.red) global.status = false

        //API Request
        function test() {
            if (message.embeds && message.embeds[0]?.color == global.color.yellow) return
            https.get('https://uptime.alpakat2.com/api2?pass=gs6gw4avvw36a564wav446wa&id=keksbot', (res) => {
                if (res.statusCode != 200) return console.error('Fehler beim Aufruf der API: ' + res.statusCode)
                var data = ''
                res.on('data', (chunk) => data += chunk)
                res.on('end', () => {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        return console.error(e.message)
                    }
                    execute(data)
                })
            })
        }

        //Nachricht aktualisieren
        async function execute(data) {
            let embed
            switch(keksbot.presence.status) {
                case 'online':
                    embed = new discord.MessageEmbed()
                        .setColor(global.color.lime)
                        .setTitle('🟢 Online')
                        .setDescription('Alles läuft fein :3')
                        .setFooter('Aktueller Ping: ' + data.lastPing + 'ms')
                    await message.edit({ embeds: [embed], content: null })
                    if(!global.status) {
                        global.status = true
                        channel.send('<@&793545885602021406> Statusinformation: online.')
                            .then((msg) => { msg.delete({ timeout: 1000 })})
                    }
                    break
                default: 
                    console.log('Status: ' + keksbot.presence.status)
                    embed = new discord.MessageEmbed()
                        .setColor(global.color.red)
                        .setTitle('❌ Offline')
                        .setDescription('Die Verbindung zu Discord wurde unterbrochen.\nDies kann mehrere Gründe haben.\nWahrscheinlich ist es ein Bug :)')
                    await message.edit({ embeds: [embed], content: null })
                    if(global.status) {
                        global.status = false
                        channel.send('<@&793545885602021406> Statusinformation: offline.')
                            .then((message) => { message.delete({ timeout: 1000 })})
                    }
            }
        }

        test()
        setInterval(() => { test() }, 30000)
    }
}