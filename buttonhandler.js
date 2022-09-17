const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')

module.exports = async (client) => {
    const buttons = []
    const readButtons = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readButtons(path.join(dir, file))
            } else {
                if(file.endsWith('.js') && !file.startsWith('subfile')) {
                    var button = require(path.join(__dirname, dir, file))
                    button.path = path.join(__dirname, dir, file)
                    if(button.execute && button.id) {
                        console.log(`[${client.user.username}]: Button ${button.id} wird geladen...`)
                    }
                    if(button.execute) buttons.push(button)
                }
            }
        }
    }
    console.log(`[${client.user.username}]: ButtonInteractions werden geladen...`)
    readButtons('buttons')
    console.log(`[${client.user.username}]: ButtonInteractions geladen.`)

    client.on('interactionCreate', async function(interaction) {
        if(interaction.type != Discord.InteractionType.MessageComponent) return
        const button = buttons.find(b => b.id === interaction.customId.replaceAll(/!.+/g, ''))
        if(!button) return
        button.execute(interaction, client)
    })
}