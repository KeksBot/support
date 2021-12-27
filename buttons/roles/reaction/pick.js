const discord = require('discord.js')
const roles = require('../../../roles.json')

module.exports = {
    id: 'roles.reaction.pick',
    async execute(ita, client) {
        const embed = new discord.MessageEmbed()
            .setColor(0xa051ae)
            .setTitle('<a:FlyingSmooch:628549586012733440> Rollenauswahl')
            .setDescription('Drück die Knöpfe, um Rollen an/aus zu schalten.\nWenn der Knopf grün ist, bekommst du die entsprechenden Benachrichtigungen.')
        let buttons = new discord.MessageActionRow()
        for (const role in roles) {
            const button = new discord.MessageButton()
                .setCustomId(`roles.reaction.pickRole!${role}`)
                .setLabel(`${role}`)
                .setStyle((
                    function() {
                        if(ita.member.roles.cache.has(roles[role])) return 'SUCCESS'
                        return 'DANGER'
                    }
                )())
            buttons.addComponents(button)
        }
        await ita.reply({ embeds: [embed], components: [buttons], ephemeral: true })
    }
}