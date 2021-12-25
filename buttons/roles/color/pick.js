const discord = require('discord.js')
const colors = require('../../../colors.json')


module.exports = {
    id: 'roles.color.pick',
    async execute(ita, client) {
        const embed = new discord.MessageEmbed()
            .setTitle('<a:FlyingSmooch:628549586012733440> Farbauswahl')
            .setDescription('Benutz die Knöpfe, um dir einen Farbton auszusuchen')
            .setColor(0xa051ae)
        let buttons = new discord.MessageActionRow()
        let buttons1 = new discord.MessageActionRow()
        for (const color in colors) {
            const button = new discord.MessageButton()
                .setCustomId(`roles.color.pickGroup!${color}`)
                .setLabel(`${color.split('')[0].toUpperCase()}${color.slice(1)}`)
                .setStyle('SECONDARY')
            if(buttons.components.length < 5) buttons.addComponents(button)
            else buttons1.addComponents(button)
        }
        await ita.reply({ embeds: [embed], components: [buttons, buttons1], ephemeral: true })
    }
}