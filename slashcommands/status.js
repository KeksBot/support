module.exports = {
    name: 'status',
    description: 'Optionen zur Statusveränderung',
    options: [
        {
            name: 'set',
            type: 'SUB_COMMAND',
            description: 'Manuelle Statuseingabe',
            options: [
                {
                    name: 'title',
                    required: true,
                    description: 'Titel der Statusanzeige',
                    type: 'STRING'
                },
                {
                    name: 'description',
                    required: true,
                    description: 'Beschreibung der Statusanzeige',
                    type: 'STRING'
                }
            ],
        },
        {
            name: 'reset',
            description: 'Status zurücksetzen',
            type: 'SUB_COMMAND'
        }
    ],
    roles: 'owner',
    execute(ita, args, client) {return true}
}