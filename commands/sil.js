const { Permissions } = require('discord.js');

module.exports = {
    name: 'sil',
    description: 'Belirtilen sayıda mesaj siler',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.reply('❌ Bu komutu kullanma yetkin yok!');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount)) {
            return message.reply('❌ Lütfen silmek istediğin mesaj sayısını belirt!');
        }

        try {
            await message.channel.bulkDelete(amount + 1);
            const reply = await message.channel.send(`✅ ${amount} mesaj silindi!`);
            setTimeout(() => reply.delete(), 3000);
        } catch (error) {
            message.reply('❌ 14 günden eski mesajları silemiyorum!');
        }
    },
};