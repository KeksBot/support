const fs = require('fs')
const path = require('path')

module.exports = {
    name: 'System Command Path Resolver',
    event: 'ready',
    once: true,
    async on(client) {
        client.systemCommands = {}
        const readEvents = dir => {
            const files = fs.readdirSync(path.join(__dirname, dir))
            for(const file of files) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file))
                if(stat.isDirectory()) {
                    readEvents(path.join(dir, file))
                } else if(file.endsWith('.js') && !file.startsWith('!')) {
                    const command = require(path.join(__dirname, dir, file))
                    if(command.name && command.execute) client.systemCommands[command.name] = path.join(__dirname, dir, file)
                    console.log(`[${client.user.username}]: System Command ${command.name} zur Registry hinzugefügt...`)
                    delete require.cache[client.systemCommands[command.name]]
                }
            }
        }
        console.log(`[${client.user.username}]: System Commands werden geladen...`)
        readEvents('../system')
        console.log(`[${client.user.username}]: System Commands geladen.`)
    }
}