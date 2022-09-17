const Discord = require('discord.js')
const roles = require('../../../roles.json')

module.exports = {
    id: 'roles.reaction.pickRole',
    async execute(ita, client) {
        let role = ita.customId.split('!')[1]
        if(ita.member.roles.cache.has(roles[role])) await ita.member.roles.remove(roles[role], 'Reactionroles')
        else await ita.member.roles.add(roles[role], 'Reactionroles')
        let buttons = [new Discord.ActionRowBuilder()]
        let index = 0
        for (const role in roles) {
            const button = new Discord.ButtonBuilder()
                .setCustomId(`roles.reaction.pickRole!${role}`)
                .setLabel(`${role}`)
                .setStyle((
                    function () {
                        if(ita.member.roles.cache.has(roles[role])) return Discord.ButtonStyle.Success
                        return Discord.ButtonStyle.Danger
                    }
                )())
            if(Math.floor(index / 5 + 0.2) != Math.floor(index / 5)) buttons.push(new Discord.ActionRowBuilder())
            buttons[Math.floor(index / 5)].addComponents(button)
            index++
        }
        await ita.update({ components: buttons })
    }    
}