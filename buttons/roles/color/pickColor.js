const Discord = require('discord.js')
const colorGroups = require('../../../colors.json')

const colorArray = []
for (const group in colorGroups) {
    for (const color in colorGroups[group]) {
        colorArray.push(colorGroups[group][color])
    }
}

module.exports = {
    id: 'roles.color.pickColor',
    async execute(ita, client) {
        let group = ita.customId.split('!')[1]
        const color = ita.customId.split('!')[2]
        await ita.member.roles.remove(colorArray, 'Farbänderung')
        await ita.member.roles.add(colorGroups[group][color], 'Farbänderung')
        const embed = new Discord.EmbedBuilder()
            .setColor(0xa051ae)
            .setTitle('<a:FlyingSmooch:628549586012733440> Farbauswahl abgeschlossen')
            .setDescription(`Du hast jetzt die Farbe ${color.split('')[0].toUpperCase()}${color.slice(1)}`)
        await ita.update({ embeds: [embed], components: [] })
    }
}