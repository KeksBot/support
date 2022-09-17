const Discord = require('discord.js')
const colorGroups = require('../../../colors.json')

const colorArray = []
for (const group in colorGroups) {
    for (const color in colorGroups[group]) {
        colorArray.push(colorGroups[group][color])
    }
}

module.exports = {
    id: 'roles.color.reset',
    async execute(ita, client) {
        await ita.member.roles.remove(colorArray, 'Farbe zurückgesetzt')
        const embed = new Discord.EmbedBuilder()
            .setColor(0xa051ae)
            .setTitle('<a:FlyingSmooch:1020818822283931709> Farbe zurückgesetzt')
            .setDescription('Du hast jetzt wieder deine normale Farbe')
        await ita.reply({ embeds: [embed] , ephemeral: true })
    }
}