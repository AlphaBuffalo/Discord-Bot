const { ChatInputCommandInteraction, ChannelSelectMenuInteraction } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');

module.exports = new ApplicationCommand({
    command: {
        name: 'set-logs',
        description: 'Set the log channel for the server.',
        type: 1,
        options: [
            {
                name: 'channel',
                description: 'The channel to set as log channel.',
                type: 7,
                required: true
            }
        ]
    },
    options: { cooldown: 5000 },
    /**
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');

        if (!interaction.guildId) {
            await interaction.reply({ content: 'This command can only be used in a server.'});
            return;
        }

        if (!channel || channel.type !== 0) { // 0 is GUILD_TEXT
            await interaction.reply({ content: 'Please select a valid text channel.' });
            return;
        }

        const key = `merit-channel`;
        client.configs_yml.set(key, channel.id);

        await interaction.reply({ content: `Log channel has been set to ${channel.name}.`});
    }
}).toJSON();