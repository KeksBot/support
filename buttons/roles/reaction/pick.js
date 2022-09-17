const Discord = require('discord.js')
const roles = require('../../../roles.json')

module.exports = {
    id: 'roles.reaction.pick',
    async execute(ita, client) {
        const embed = new Discord.EmbedBuilder()
            .setColor(0xa051ae)
            .setTitle('<a:FlyingSmooch:628549586012733440> Rollenauswahl')
            .setDescription('Drück die Knöpfe, um Rollen an/aus zu schalten.\nWenn der Knopf grün ist, bekommst du die entsprechenden Benachrichtigungen.')
        let buttons = [new Discord.ActionRowBuilder()]
        let index = 0
        for (const role in roles) {
            const button = new Discord.ButonBuilder()
                .setCustomId(`roles.reaction.pickRole!${role}`)
                .setLabel(`${role}`)
                .setStyle((
                    function () {
                        if(ita.member.roles.cache.has(roles[role])) return Discord.ButtonStyle.Success
                        return Discord.ButtonStyle.Danger
                    }
                )())
            if(Math.floor((index / 5) + 0.2) != Math.floor(index / 5)) buttons.push(new Discord.ActionRowBuilder())
            buttons[Math.floor(index / 5)].addComponents(button)
            index++
        }
        await ita.reply({ embeds: [embed], components: buttons, ephemeral: true })
    }
}