const mongoose = require('mongoose')

var userdataSchema = mongoose.Schema({
    _id: { type: String, required: true },
    xp: Number,
    level: Number,
    cookies: Number,
    giftdm: Number,
    thismin: Number,
    badges: {
        partner: Number,
        verified: Boolean,
        team: Boolean,
        dev: Boolean,
        mod: Boolean,
        beta: Boolean
    },
    banned: {
        time: Number,
        reason: String
    },
    battle: {
        skills: [
            {
                _id: false,
                name: String,
                value: Number
            }
        ],
        ready: Boolean,
        priority: String,
        currentHP: Number,
        healTimestamp: Number,
        inventory: [{
            id: Number,
            count: Number,
            _id: false
        }],
        attacks: [Number],
    },
    system: {
        user: String,
        bounduser: String,
        password: String,
        username: String,
        permissionLevel: Number,
        _id: false
    }
}, { strict: true })

const model = mongoose.model('userdata', userdataSchema)
module.exports = model