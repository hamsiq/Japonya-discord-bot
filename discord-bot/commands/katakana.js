const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// NOT: Buradaki URL'yi kendi Discord CDN linkinle değiştir.
// Örn: resmi bir kanala yükle, sağ tık > Linki kopyala.
const KATAKANA_IMAGE_URL = 'https://media.discordapp.net/attachments/1464983796058423449/1466352152938024981/07a083f82ef189e124dbd7cd69ad7338ee6e9d2b.png?ex=697c6e5c&is=697b1cdc&hm=515b492b89d1729c9521874e6d1d5eafaf4f4e2d9cc227536b7dceef720d00ca&=&format=webp&quality=lossless&width=1209&height=855';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('katakana')
        .setDescription('Katakana alfabesi görselini gösterir'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🇯🇵 Katakana Tablosu')
            .setImage(KATAKANA_IMAGE_URL)
            .setColor(0xf093fb)
            .setFooter({ text: 'Görsel: Katakana chart' });
        
        await interaction.reply({ embeds: [embed] });
    }
};

