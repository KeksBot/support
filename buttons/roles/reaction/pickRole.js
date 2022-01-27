const discord = require('discord.js')
const roles = require('../../../roles.json')

module.exports = {
    id: 'roles.reaction.pickRole',
    async execute(ita, client) {
        let role = ita.customId.split('!')[1]
        if(ita.member.roles.cache.has(roles[role])) await ita.member.roles.remove(roles[role], 'Reactionroles')
        else await ita.member.roles.add(roles[role], 'Reactionroles')
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
            if(Math.floor(index / 5 + 0.2) != Math.floor(index / 5)) buttons.push(new discord.MessageActionRow())
            buttons[Math.floor(index / 5)].addComponents(button)
            index++
        }
        await ita.update({ components: buttons })
    }    
}