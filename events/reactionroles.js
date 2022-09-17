const Discord = require('discord.js')

module.exports = {
    name: 'KeksBot Support Reaction Roles',
    event: 'ready',
    once: true,
    async on(client) {
        const data = require('../data.json')
        let guild = await client.guilds.fetch('775001585541185546')
        let channel = await guild.channels.fetch('780008035678421022')
        var embed = new Discord.EmbedBuilder()
            .setColor(0xa051ae)
            .setTitle('Rollenauswahl')
            .setDescription('Drücke auf einen Knopf, um dir eine Anzeigefarbe auszusuchen oder deine (Ping) Rollen zu ändern.')
        let message
        try {
            message = await channel.messages.fetch(data.roleColorMessageID)
        } catch {}
        if(!message?.editable) {
            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('roles.color.pick')
                        .setLabel('Farbe aussuchen')
                        .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                        .setCustomId('roles.color.reset')
                        .setLabel('Farbe zurücksetzen')
                        .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                        .setCustomId('roles.reaction.pick')
                        .setLabel('Rollen aussuchen')
                        .setStyle(Discord.ButtonStyle.Secondary)
                )
            message = await channel.send({ embeds: [embed], components: [buttons] })
            data.roleColorMessageID = message.id
            require('fs').writeFileSync('data.json', JSON.stringify(data))
        }
    }
}