const cron = require('node-cron');
const fs = require('fs');
const yaml = require('js-yaml');


function cronjob(client,guildId,channelId){
    cron.schedule("0 9 * * *", async () => {
    
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;
        const limit = 500;

        function truncate(text, max) {
            return text.length > max ? text.slice(0, max - 1) + "…" : text;
        }
        function formatRow(r) {
            return (truncate(r.name, 16).padEnd(16) + " " +
                //(r.owned ? "🔒" : "🔓").padEnd(2) + " " 
                + String(r.merit).padStart(2) + " " +
                truncate(r.alpha, 16).padEnd(16) + " " +
                truncate(r.comment, 30));
        }
        function formatTable(rows) {
            const header = "Fag              MP Last Alpha       Comment\n" +
                "-------------------------------------------------------";
            return header + "\n" + rows.map(formatRow).join("\n");
        }

        let db = {};
        try { db = yaml.load(fs.readFileSync('./database.yml', 'utf8')) || {}; } 
        catch (e) { console.log('Unable to read database file.'); return; } 
        
        const entries = Object.entries(db).filter(([k]) => k.startsWith(`points-${guildId}`)).map(([k, v]) => ({ userId: k.split('-').pop(), points: v.amount || 0, info: v })).sort((a, b) => b.points - a.points).slice(0, limit); 
        if (!entries.length) { return; } 
        const lines = await Promise.all(entries.map(async (e, i) => { 
            try { const guild = await client.guilds.fetch(guildId, { force: true }); 
            const fag = await guild.members.fetch(e.userId); 
            let owned = fag.roles.cache.has(client.configs_yml.get('fag-role')); 
            const alpha = await guild.members.fetch(e.info.alpha); 
            return { name: fag.user.displayName, owned: owned, merit: e.points, alpha: alpha.user.displayName, comment: e.info.reason } } 
        catch (error) { console.log(error); return; } }));

        const embed = { title: "Daily Merit Leaderboard", description: "```" + formatTable(lines) + "```", color: 0x3498db };

        




    await channel.send({ embeds: [embed] });
    });
    
}

module.exports = cronjob;