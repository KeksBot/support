const discord = require('discord.js')
const colorGroups = require('../../../colors.json')

module.exports = {
    id: 'roles.color.pickGroup',
    async execute(ita, client) {
        const label = ita.component?.label
        if(!label) return require('../../../embeds').error(ita, 'Fehler', 'Die gesuchte Farbe wurde nicht gefunden :c')
        const colorGroup = colorGroups[label.toLowerCase()]
        if(!colorGroup) return require('../../../embeds').error(ita, 'Fehler', 'Die gesuchte Farbe wurde nicht gefunden :c')
        const embed = new discord.MessageEmbed()
            .setTitle(`<a:FlyingSmooch:628549586012733440> Farbauswahl | ${label}`)
            .setDescription('Benutz die Knöpfe, um dir eine Farbe auszusuchen')
            .setColor(0xa051ae)
        let buttons = new discord.MessageActionRow()
        for (const color in colorGroup) {
            buttons.addComponents(
                new discord.MessageButton()
                    .setCustomId(`roles.color.pickColor!${label.toLowerCase()}!${color}`)
                    .setLabel(`${color.split('')[0].toUpperCase()}${color.slice(1)}`)
                    .setStyle('SECONDARY')
            )
        }
        await ita.update({ embeds: [embed], components: [buttons] })
    }
}