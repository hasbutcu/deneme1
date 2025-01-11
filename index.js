// index.js
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

// Komutları yükle
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Bot hazır olduğunda
client.once('ready', () => {
    console.log(`${client.user.tag} aktif! 🚀`);
    client.user.setActivity('2ELATES', { type: 'LISTENING' });
});

// Hata yakalama
client.on('error', error => {
    console.error('Bot bir hata ile karşılaştı:', error);
});

// Komutları dinle
client.on('messageCreate', async message => {
    const prefix = '!';
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('❌ Komutu çalıştırırken bir hata oluştu!');
    }
});

// Yeni üye geldiğinde
client.on('guildMemberAdd', async member => {
    try {
        // Otorol
        const role = member.guild.roles.cache.get('OTOROL_ID_BURAYA');
        if (role) {
            await member.roles.add(role);
            
            const welcomeEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('🎉 Yeni Üye!')
                .setDescription(`Hoş geldin ${member.user.username}! Otomatik olarak rolün verildi.`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();
            
            const channel = member.guild.channels.cache.get('HOSGELDIN_KANAL_ID_BURAYA');
            if (channel) channel.send({ embeds: [welcomeEmbed] });
        }
    } catch (error) {
        console.error('Otorol hatası:', error);
    }
});

// Botu başlat
client.login(process.env.TOKEN);
