const Discord = require('discord.js')
const embeds = require('../embeds')

/* permissionLevels
    0: default user
    1: privileged user (general information commands)
    2: something for the future i guess
    3: administrator (create systemusers and stuff)
    4: super-user (tru power :3)
*/

module.exports = {
    name: 'system',
    description: 'Systemkonsole',
    async execute(interaction, args, client) {
        const { user, color } = interaction
        await interaction.showModal(
            new Discord.ModalBuilder()
                .setTitle('Systemkonsole')
                .setCustomId('system.interface')
                .setComponents(
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.TextInputBuilder()
                                .setStyle(Discord.TextInputStyle.Short)
                                .setCustomId('system.interface.input')
                                .setPlaceholder('> ')
                                .setLabel('KeksBot Terminal Input')
                        )
                )
        )
        interaction = await interaction.awaitModalSubmit({ time: 150000 }).catch(() => null)
        if(!interaction) return
        let input = interaction.components[0].components[0].value || ''
        input = input.replaceAll('&& system', '&& &').replaceAll('| system', '| >').replace('system', '').trim()
        let commands = input.split(/&&|\|/g).map(s => s.trim())
        if(!client.systemCommands) return embeds.error(interaction, 'Fehler', 'systemcommand nicht initialisiert', true)
        let output
        for (const input of commands) {
            let command
            let commandName = input.replace(/^(& )|^(> )/, '').trim().split(' ')[0]
            let args = []
            let quotefound = false
            let currentarg = ''
            for (const arg of input.replace(/^(& )|^(> )/, '').trim().split(' ')) {
                if(!arg.includes('"') && !quotefound) {
                    args.push(arg)
                } else if(arg.includes('"') && !quotefound) {
                    quotefound = true
                    currentarg = arg
                } else if(!arg.includes('"') && quotefound) {
                    currentarg += ' ' + arg
                } else if(arg.includes('"') && quotefound) {
                    quotefound = false
                    currentarg += ' ' + arg
                    args.push(currentarg)
                }
            }
            args.shift()
            args = args.filter(a => a)
            args.forEach((arg, i) => {
                if(arg.startsWith('-') && i + 1 < args.length && !args[i + 1].startsWith('-')) {
                    args[i] += ' ' + args[i + 1]
                    args.splice(i + 1, 1)
                }
            })
            args = args.sort((a, b) => {
                if(a.startsWith('-') && !b.startsWith('-')) return 1
                if(!a.startsWith('-') && b.startsWith('-')) return -1
                return 0
            })
            try {
                command = require(client.systemCommands[commandName])
            } catch (e) {
                return embeds.error(interaction, 'Fehler', `systemcommand unbekannt: \n \`system ${commandName}\` konnte nicht lokalisiert werden`, true)
            }
            if(!command) return embeds.error(interaction, 'Fehler', `systemcommand unbekannt: \n \`system ${commandName}\` konnte nicht lokalisiert werden`, true)
            if((command.permissionLevel && command.permissionLevel > user.data.system?.permissionLevel) || !user.data.system?.permissionLevel) return embeds.error(interaction, 'Fehler', `systemcommand unbekannt: \n \`system ${commandName}\` konnte nicht gefunden werden`, true)
            try {
                output = await command.execute(interaction, args, input.startsWith('>') ? output : null)
                if(output.interaction) interaction = output.interaction
            } catch (e) {
                if(e.name == 'SystemError') {
                    delete require.cache[client.systemCommands[commandName]]
                    return embeds.error(interaction, e.type, e.message, true)
                }
                console.error('systemcommand error:', new Date().toLocaleString())
                console.error(input)
                console.error('executing systemcommand', commandName, 'failed with error:')
                console.error(e)
                delete require.cache[client.systemCommands[commandName]]
                return embeds.error(interaction, 'Fehler', `systemcommand konnte nicht ausgeführt werden: \n \`\`\`js\n${e}\`\`\``, true)
            }
            delete require.cache[client.systemCommands[commandName]]
        }
        if(!interaction.replied) {
            let embed
            if(output.message && output.showMessage) output = output.message
            try {
                embed = new Discord.EmbedBuilder()
                    .setColor(color.lime)
                    .setTitle('Systemkonsole')
                    .setDescription(
                        typeof output === 'string' ? '```\n' + output.substring(0, 4000) + '```' :
                        typeof output === 'number' || typeof output === 'bigint' ? '```js\n' + output.toString() + '```' :
                        typeof output === 'boolean' ? '```js\n' + output.toString() + '```' :
                        typeof output === 'object' ? '```json\n' + JSON.stringify(output, null, 4).substring(0, 4000).replaceAll('\\', '') + '```' :
                        typeof output === 'undefined' ? '```js\n' + 'undefined' + '```' :
                        'unknown'
                )
            } catch (e) {console.error(e)}
            if(!embed) return embeds.error(interaction, 'Fehler', 'systemcommand output konnte nicht verarbeitet werden', true)
            if(interaction.deferred || interaction.replied) await interaction.editReply({ embeds: [embed] })
            else await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}