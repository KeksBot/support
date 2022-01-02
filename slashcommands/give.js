const discord = require('discord.js')
const fs = require('fs')
const getData = require('../db/getData')
const update = require('../db/update')
const embeds = require('../embeds')

module.exports = {
    name: 'give',
    roles: 'mod',
    description: 'Ändert die Kekse eines Nutzers',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'Nutzer, der Kekse bekommen soll',
            required: true
        },
        {
            name: 'count',
            type: 'INTEGER',
            description: 'Anzahl der Kekse, die hinzugefügt/entfernt werden soll. (Negative Werte möglich)',
            required: true
        },
        {
            name: 'overwrite',
            type: 'BOOLEAN',
            description: 'Wenn true: Kekse des Nutzers werden auf count gesetzt. Standardmäßig false',
            required: false
        },
        {
            name: 'show-message',
            type: 'BOOLEAN',
            description: 'Wenn true wird die Antwort im Chat für alle angezeigt. Standardmäßig false',
            required: false
        }
    ],
    async execute(ita, args, client) {
        var { user, color } = ita
        var user1 
        try { user1 = await client.users.fetch(args.user) } catch {}
        if(!user1) return embeds.error(ita, 'Unbekannter Nutzer', `\`${args.user}\` ist kein valider Account.\nBitte gib einen Nutzer von diesem Server oder eine gültige User ID an.`, true)
        user1.data = await getData('userdata', user1.id) || { cookies: 0 }
        const data = require('../data.json')
        let channel = await (await client.guilds.fetch('775001585541185546')).channels.fetch('801406480309289002')
        data.teamaction++
        fs.writeFileSync('data.json', JSON.stringify(data))
        let embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`Kontostand geändert (ID: ${data.teamaction})`)
            .setDescription(`${user} hat den Kontostand von **${user1.tag}** geändert.`)
            .addField('Alter Kontostand', `${user1.data.cookies}`, true)
        if(args.overwrite) {
            if(args.count < user1.data.cookies) embed.addField('Entfernt', (user1.data.cookies - args.count).toString(), true)
            else embed.addField('Hinzugefügt', (args.count - user1.data.cookies).toString(), true)
            user1.data.cookies = (function() {if(args.count == 0) { return 0 } else return Math.abs(args.count) || user1.data.cookies})()
            embed.addField('Neuer Kontostand', `${user1.data.cookies}`, true)
            await channel.send({ embeds: [embed] })
            await update('userdata', user1.id, { cookies: user1.data.cookies })
        } else {
            user1.data.cookies += args.count || 0
            if(user1.data.cookies < 0) user1.data.cookies = 0
            if(args.count < 0) embed.addField('Entfernt', Math.abs(args.count).toString(), true)
            else embed.addField('Hinzugefügt', args.count.toString(), true)
            embed.addField('Neuer Kontostand', `${user1.data.cookies}`, true)
            await channel.send({ embeds: [embed] })
            await update('userdata', user1.id, { cookies: user1.data.cookies })
        }
        embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(args.overwrite ? `Kekse von ${user1.username} wurden überschrieben` : (args.count > 0 ? `${user1.username} hat Kekse erhalten` : `Kekse von ${user1.username} entfernt`))
            .setDescription(`${user1.tag} hat nun ${user1.data.cookies} Kekse`)
        await ita.reply({ embeds: [embed], ephemeral: !args.show_message })
    }
}