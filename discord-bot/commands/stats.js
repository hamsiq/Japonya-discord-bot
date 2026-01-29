const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Öğrenme istatistiklerinizi gösterir'),
    
    async execute(interaction, { db }) {
        const userId = interaction.user.id;
        
        db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: '❌ Veritabanı hatası!', ephemeral: true });
            }
            
            if (!row) {
                // Kullanıcı yoksa oluştur
                db.run('INSERT INTO users (user_id) VALUES (?)', [userId], function(err) {
                    if (err) {
                        console.error(err);
                        return interaction.reply({ content: '❌ Veritabanı hatası!', ephemeral: true });
                    }
                    
                    const embed = new EmbedBuilder()
                        .setTitle('📊 İstatistikleriniz')
                        .setDescription('Henüz veri yok. Hemen öğrenmeye başlayın!')
                        .addFields(
                            { name: 'Seviye', value: 'N5', inline: true },
                            { name: 'XP', value: '0', inline: true },
                            { name: 'Öğrenilen Kelimeler', value: '0', inline: true },
                            { name: 'Öğrenilen Kanji', value: '0', inline: true },
                            { name: 'Seri', value: '0 gün', inline: true }
                        )
                        .setColor(0x667eea);
                    
                    interaction.reply({ embeds: [embed] });
                });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('📊 İstatistikleriniz')
                    .addFields(
                        { name: 'Seviye', value: row.level || 'N5', inline: true },
                        { name: 'XP', value: row.xp?.toString() || '0', inline: true },
                        { name: 'Öğrenilen Kelimeler', value: row.words_learned?.toString() || '0', inline: true },
                        { name: 'Öğrenilen Kanji', value: row.kanji_learned?.toString() || '0', inline: true },
                        { name: 'Seri', value: `${row.streak || 0} gün`, inline: true }
                    )
                    .setColor(0x667eea)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                
                interaction.reply({ embeds: [embed] });
            }
        });
    }
};
