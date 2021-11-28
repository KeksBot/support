const discord = require('discord.js')
const { exec } = require('child_process')
const path = require('path')
const path = require('path')

module.exports = {
    name: 'update',
    description: 'Updatet den Bot',
    options: [
        {
            name: 'bot',
            description: 'Welcher Bot geupdatet werden soll',
            type: 'STRING',
            choices: [
                {
                    name: 'keksbot',
                    value: 'keksbot'
                },
                {
                    name: 'keksbot support',
                    value: 'support'
                }
            ],
            required: true
        },
        {
            name: 'branch',
            description: 'Von welcher Branch gepullt werden soll',
            type: 'STRING',
            choices: [
                {
                    name: 'main',
                    value: 'main'
                },
                {
                    name: 'dev',
                    value: 'dev'
                }
            ],
            required: true
        }
    ],
    roles: 'owner',
    async execute(ita, args, client) {
        const { color } = ita
        let path = (args.bot === 'keksbot') ? path.join(process.cwd, require('../config.json').path) : process.cwd
        let embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle('Update eingeleitet')
    }
}