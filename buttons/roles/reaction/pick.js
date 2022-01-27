const discord = require('discord.js')
const roles = require('../../../roles.json')

module.exports = {
    id: 'roles.reaction.pick',
    async execute(ita, client) {
        const embed = new discord.MessageEmbed()
            .setColor(0xa051ae)
            .setTitle('<a:FlyingSmooch:628549586012733440> Rollenauswahl')
            .setDescription('Drück die Knöpfe, um Rollen an/aus zu schalten.\nWenn der Knopf grün ist, bekommst du die entsprechenden Benachrichtigungen.')
        let buttons = [new discord.MessageActionRow()]
        let index = 0
        for (const role in roles) {
            const button = new discord.MessageButton()
                .setCustomId(`roles.reaction.pickRole!${role}`)
                .setLabel(`${role}`)
                .setStyle((
                    function () {
                        if(ita.member.roles.cache.has(roles[role])) return 'SUCCESS'
                        return 'DANGER'
                    }
                )())
            if(Math.floor((index / 5) + 0.2) != Math.floor(index / 5)) buttons.push(new discord.MessageActionRow())
            buttons[Math.floor(index / 5)].addComponents(button)
            index++
        }
        await ita.reply({ embeds: [embed], components: buttons, ephemeral: true })
    }
}