const { ModalSubmitInteraction, MessageFlags } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
    customId: 'config-modal',
    type: 'modal',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {

        const field = interaction.fields.getSelectedChannels('Log Channel');

        await interaction.reply({
            content: 'The channel for logs is now set to ' + field,
            flags: MessageFlags.Ephemeral
        });

    }
}).toJSON();