const discord = require('discord.js'),
    getData = require('../db/getData'),
    update = require('../db/update'),
    fs = require('fs')
const embeds = require('../embeds')

module.exports = {
    name: 'ban',
    description: 'Sperrt Commands für eine Person',
    roles: 'mod',
    options: [
        {
            name: 'user',
            type: 'USER',
            required: true,
            description: 'Der zu bannende Nutzer'
        },
        {
            name: 'unban',
            type: 'BOOLEAN',
            required: false,
            description: 'True, wenn der ausgewählte Nutzer entbannt werden soll. Standardmäßig false'
        },
        {
            name: 'duration',
            type: 'STRING',
            required: false,
            description: 'Realtive Zeitangabe für temporäre Bans'
        },
        {
            name: 'reason',
            type: 'STRING',
            required: false,
            description: 'Begründung für den Ban'
        }
    ],
    async execute(ita, args, client) {
        var { user, color } = ita
        var user1
        try { user1 = await client.users.fetch(args.user) } catch (err) {}
        if(!user1) return embeds.error(ita, 'Unbekannter Nutzer', `\`${args.user}\` ist kein valider Account.\nBitte gib einen Nutzer von diesem Server oder eine gültige User ID an.`, true)
        user1.data = await getData('userdata', args.user)
        let banned = user1.data.banned || {}
        var channel = await (await client.guilds.fetch('775001585541185546')).channels.fetch('801406480309289002')
        const data = require('../data.json')
        if(args.unban) {
            console.log(banned)
            if(banned.time) {
                await update('userdata', args.user, { banned: null })
                embeds.success(ita, 'Nutzer entbannt', `${user1.tag} wurde erfolgreich entbannt.`, true)
                data.teamaction++
                fs.writeFileSync('data.json', JSON.stringify(data))
                let embed = new discord.MessageEmbed()
                    .setColor(color.normal)
                    .setTitle(`Nutzer entbannt (ID: ${data.teamaction})`)
                    .setDescription(`${user} hat **${user1.tag}** entbannt.`)
                return await channel.send({ embeds: [embed] })
            }
            return embeds.error(ita, 'Nutzer nicht gebannt', `${user1.tag} ist nicht gebannt.`, true)
        }
        var time = 0
        if(!args.duration) args.duration = ''
        let timeparts = args.duration.split(/ +/)
        timeparts.forEach(data => {
            if(data.toLowerCase().endsWith('y')) time += parseInt(data) * 1000 * 60 *60 * 24 * 365
            else if(data.endsWith('M')) time += parseInt(data) * 1000 * 60 * 60 * 24 * 30
            else if(data.toLowerCase().endsWith('w')) time += parseInt(data) * 1000 * 60 * 60 * 24 * 7
            else if(data.toLowerCase().endsWith('d')) time += parseInt(data) * 1000 * 60 * 60 * 24
            else if(data.toLowerCase().endsWith('h')) time += parseInt(data) * 1000 * 60 * 60
            else if(data.endsWith('m')) time += parseInt(data) * 1000 * 60
            else if(data.toLowerCase().endsWith('s')) time += parseInt(data) * 1000
        })
        if(time) time = new Date(Date.now() + time)
        else time = -1
        let ban = {
            time
        }
        if(args.reason) ban.reason = args.reason
        await update('userdata', args.user, { banned: ban })
        data.teamaction++
        fs.writeFileSync('data.json', JSON.stringify(data))
        let embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`Nutzer gebannt (ID: ${data.teamaction})`)
            .setDescription(`${user} hat **${user1.tag}** gebannt.`)
        if(args.reason) embed.addField('Begründung', args.reason, true)
        if(time != -1) embed.addField('Automatische Aufhebung', `<t:${Math.floor(time / 1000)}:R>\n<t:${Math.floor(time / 1000)}>`, true)
        await channel.send({ embeds: [embed] })
        embed = new discord.MessageEmbed()
            .setColor(color.lime)
            .setTitle('Nutzer gebannt')
            .setDescription(`${user1.tag} wurde erfolgreich gebannt.`)
        if(args.reason) embed.addField('Begründung', args.reason, true)
        if(time != -1) embed.addField('Automatische Aufhebung', `<t:${Math.floor(time / 1000)}:R>\n<t:${Math.floor(time / 1000)}>`, true)
        await ita.reply({ embeds: [embed], ephemeral: true })
    }
}