const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ApplicationCommand, ChannelSelectMenuInteraction } = require('discord.js');



module.exports = new ApplicationCommand({
    command: {
        name: 'config-modal',
        description: 'Opens a configuration modal.',
    },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const modal = new ModalBuilder({
            custom_id: 'config-modal',
            title: 'Configuration Modal',
            components: [{
                type: 8, // channel select type
                components: [
                    new interaction.ChannelSelectMenuInteraction({
                        custom_id: 'Log Channel',
                        label: 'Enter the log channel ID:',
                        placeholder: 'Select a channel',
                        required: true,
                    })
                ]
            }]
        });
    }

}).toJSON();