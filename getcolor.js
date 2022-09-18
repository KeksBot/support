const { Guild } = require("discord.js")

/**
 * 
 * @param {Guild} guild 
 * @returns {Promise<{ red: String, yellow: String, lime: String, normal: String, lightblue: String}>} color object
 */

module.exports = async (guild) => {
    if(!guild) return { red: 0xE62535, yellow: 0xF2E03F, lime: 0x25D971, normal: 0x00b99b, lightblue: 0x3498db }
    if(!guild.data) guild.data = await guild.getData()
    if(guild.data?.theme) {
        let { 
            red = 0xE62535, 
            yellow = 0xF2E03F, 
            lime = 0x25D971,
            normal = 0x00b99b,
            lightblue = 0x3498db
        } = guild.data.theme

        if(normal == 'role') normal = guild.members.me?.displayHexColor || 0x00b99b
        return { red, yellow, lime, normal }
    } else return { red: 0xE62535, yellow: 0xF2E03F, lime: 0x25D971, normal: 0x00b99b,lightblue: 0x3498db }
}