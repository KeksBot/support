const Discord = require('discord.js')
const colors = require('../../../colors.json')


module.exports = {
    id: 'roles.color.pick',
    async execute(ita, client) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('<a:FlyingSmooch:1020818822283931709> Farbauswahl')
            .setDescription('Benutz die Knöpfe, um dir einen Farbton auszusuchen')
            .setColor(0xa051ae)
        let buttons = new Discord.ActionRowBuilder()
        let buttons1 = new Discord.ActionRowBuilder()
        for (const color in colors) {
            const button = new Discord.ButtonBuilder()
                .setCustomId(`roles.color.pickGroup!${color}`)
                .setLabel(`${color.split('')[0].toUpperCase()}${color.slice(1)}`)
                .setStyle(Discord.ButtonStyle.Secondary)
            if(buttons.components.length < 5) buttons.addComponents(button)
            else buttons1.addComponents(button)
        }
        await ita.reply({ embeds: [embed], components: [buttons, buttons1], ephemeral: true })
    }
}