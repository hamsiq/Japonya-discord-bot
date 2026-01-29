const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// NOT: Buradaki URL'yi kendi Discord CDN linkinle değiştir.
// Örn: resmi bir kanala yükle, sağ tık > Linki kopyala.
const HIRAGANA_IMAGE_URL = 'https://media.discordapp.net/attachments/1464983796058423449/1466352152443093024/5b001e895e829a29322d067dbb6fe1778f954a7d.png?ex=697c6e5c&is=697b1cdc&hm=f47d615da9703ac3fa3e5923ca478af89813743b97d1ba1f28dfcf0e0f608c36&=&format=webp&quality=lossless&width=1209&height=855';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hiragana')
        .setDescription('Hiragana alfabesi görselini gösterir'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🇯🇵 Hiragana Tablosu')
            .setImage(HIRAGANA_IMAGE_URL)
            .setColor(0x667eea)
            .setFooter({ text: 'Görsel: Hiragana chart' });
        
        await interaction.reply({ embeds: [embed] });
    }
};
