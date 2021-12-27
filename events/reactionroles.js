const discord = require('discord.js')

module.exports = {
    name: 'KeksBot Support Reaction Roles',
    event: 'ready',
    once: true,
    async on(client) {
        const data = require('../data.json')
        let guild = await client.guilds.fetch('775001585541185546')
        let channel = await guild.channels.fetch('780008035678421022')
        var embed = new discord.MessageEmbed()
            .setColor(0xa051ae)
            .setTitle('Rollenauswahl')
            .setDescription('Drücke auf einen Knopf, um dir eine Anzeigefarbe auszusuchen oder deine (Ping) Rollen zu ändern.')
        let message
        try {
            message = await channel.messages.fetch(data.roleColorMessageID)
        } catch {}
        if(!message?.editable) {
            let buttons = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId('roles.color.pick')
                        .setLabel('Farbe aussuchen')
                        .setStyle('SECONDARY'),
                    new discord.MessageButton()
                        .setCustomId('roles.color.reset')
                        .setLabel('Farbe zurücksetzen')
                        .setStyle('SECONDARY'),
                    new discord.MessageButton()
                        .setCustomId('roles.reaction.pick')
                        .setLabel('Rollen aussuchen')
                        .setStyle('SECONDARY')
                )
            message = await channel.send({ embeds: [embed], components: [buttons] })
            data.roleColorMessageID = message.id
            require('fs').writeFileSync('data.json', JSON.stringify(data))
        }
    }
}