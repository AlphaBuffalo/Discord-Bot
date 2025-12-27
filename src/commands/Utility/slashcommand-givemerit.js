const { ChatInputCommandInteraction, Role } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');

module.exports = new ApplicationCommand({
    command: {
        name: 'givemerit',
        description: 'Give a merit to another user.',
        type: 1,
        options: [
            { name: 'fag', description: 'The Fag to give merit to', type: 6, required: true },
            { name: 'amount', description: 'Amount of merits to give', type: 4, required: true },
            { name: 'reason', description: 'Reason of the merit', type: 3, required: true }
        ]
    },
    options: {
        cooldown: 2000
    },
    /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy+"-"+mm+"-"+dd; //This is some euro crap here


        const target = interaction.options.getUser('fag');
        const amount = interaction.options.getInteger('amount');
        const alpha = interaction.user;
        const reason = interaction.options.getString('reason');
        

        const key = `points-${interaction.guildId}-${target.id}`;
        const history = `points-${interaction.guildId}-${target.id}-history`;
        let current_value = client.database.has(key) ? client.database.get(key) : {alpha:alpha.id,reason:reason,amount:amount,date:today};
        const currentMeritPoints = client.database.has(key) ? current_value.amount || 0 : 0;
        let history_value = client.database.has(history) ? client.database.get(history) : [];
        const updated = currentMeritPoints + amount;
        current_value.amount = updated;
        if (!interaction.guildId) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        if (!target) {
            await interaction.reply({ content: 'User not found.', ephemeral: true });
            return;
        }

        if (!Number.isInteger(amount)) {
            await interaction.reply({ content: 'Please provide a valid integer amount.', ephemeral: true });
            return;
        }

        if (amount < -10 || amount > 10) {
            await interaction.reply({ content: 'You can only give between -10 and 10 points at a time.', ephemeral: true });
            return;
        }

        if (updated <= -10 || updated >= 10) {
            await interaction.reply({ content: 'No one can have less than -10 or more than 10 points.', ephemeral: true })
            return;
        }


        history_value.push({
            alpha:alpha.displayName,
            reason:reason,
            amount:amount,
            date:today
        });

        //updating the databse
        client.database.set(key, current_value);
        client.database.set(history, history_value);

        //sending to the log channel
        try {
           // const channelId = '1453456363400462458';
            const channelId = '1453182414456356937'; //Changed to log channel
            const channel = await client.channels.fetch(channelId);
            if (channel){
                await channel.send({content: `${alpha.displayName} gave **${amount}** merit(s) to **${target.tag}**. They now have **${updated}** merit(s).`});
            }    
        } catch (error) {
            console.log(error);
        }
        
        //responding to the user
        await interaction.reply({ content: `${alpha.displayName} gave **${amount}** merit(s) to **${target.tag}**. They now have **${updated}** merit(s).`, ephemeral: false });

    }
}).toJSON();
