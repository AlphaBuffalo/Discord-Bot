const { ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'show-modal',
        description: '[TESTING COMMAND] Opens a modal.',
        type: 1,
        options: []
    },
    options: {
        botDevelopers: true
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.showModal(
            {
                custom_id: 'config-modal',
                title: 'Configuration Menu',
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: 'Log Channel',
                        label: 'What channel do you want to log to?',
                        max_length: 15,
                        min_length: 2,
                        placeholder: 'Enter Channel ID',
                        style: 1,
                        required: true
                    }]
                }]
            }
        )
    }
}).toJSON();