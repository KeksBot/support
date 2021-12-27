const discord = require('discord.js')
const roles = require('../../../roles.json')

module.exports = {
    id: 'roles.reaction.pickRole',
    async execute(ita, client) {
        let role = ita.customId.split('!')[1]
        if(ita.member.roles.cache.has(roles[role])) await ita.member.roles.remove(roles[role], 'Reactionroles')
        else await ita.member.roles.add(roles[role], 'Reactionroles')
        let buttons = new discord.MessageActionRow()
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
            buttons.addComponents(button)
        }
        await ita.update({ components: [buttons] })
    }    
}