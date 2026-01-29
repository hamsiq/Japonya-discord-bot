const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Japonca quiz yap')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('JLPT seviyesi')
                .setRequired(false)
                .addChoices(
                    { name: 'N5', value: 'N5' },
                    { name: 'N4', value: 'N4' },
                    { name: 'N3', value: 'N3' },
                    { name: 'N2', value: 'N2' },
                    { name: 'N1', value: 'N1' }
                )),
    
    async execute(interaction, { db, vocabulary }) {
        const level = interaction.options.getString('level') || 'N5';
        
        const filtered = vocabulary.filter(v => v.level === level);
        if (filtered.length < 4) {
            return interaction.reply({ 
                content: '❌ Bu seviyede yeterli kelime yok!', 
                ephemeral: true 
            });
        }
        
        // Rastgele soru seç
        const correct = filtered[Math.floor(Math.random() * filtered.length)];
        const wrong = filtered
            .filter(v => v.japanese !== correct.japanese)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        const options = [correct, ...wrong].sort(() => 0.5 - Math.random());
        
        const embed = new EmbedBuilder()
            .setTitle('📝 Quiz')
            .setDescription(`**${correct.japanese}** (${correct.romaji}) kelimesinin anlamı nedir?`)
            .setColor(0x667eea)
            .setFooter({ text: `Seviye: ${level}` });
        
        const userId = interaction.user.id;
        const row = new ActionRowBuilder();
        options.forEach((opt, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`quiz_answer_${opt.japanese}_${correct.japanese}_${level}_${userId}`)
                    .setLabel(`${index + 1}. ${opt.meaning}`)
                    .setStyle(ButtonStyle.Secondary)
            );
        });
        
        await interaction.reply({ embeds: [embed], components: [row] });
    },
    
    async handleButton(interaction, { db, vocabulary }) {
        const parts = interaction.customId.split('_');
        const action = parts[1];
        const buttonUserId = parts[parts.length - 1]; // Son kısım kullanıcı ID'si
        
        // Sadece komutu kullanan kişi butonlara basabilir
        if (interaction.user.id !== buttonUserId) {
            return interaction.reply({ 
                content: '❌ Bu butonlar sadece komutu kullanan kişi tarafından kullanılabilir!', 
                ephemeral: true 
            });
        }
        
        const userId = interaction.user.id;
        
        if (action === 'next') {
            // Sonraki soru göster
            const level = parts[2]; // quiz_next_LEVEL_USERID
            const filtered = vocabulary.filter(v => v.level === level);
            if (filtered.length < 4) {
                return interaction.reply({ 
                    content: '❌ Bu seviyede yeterli kelime yok!', 
                    ephemeral: true 
                });
            }
            
            const correctWord = filtered[Math.floor(Math.random() * filtered.length)];
            const wrong = filtered
                .filter(v => v.japanese !== correctWord.japanese)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            
            const options = [correctWord, ...wrong].sort(() => 0.5 - Math.random());
            
            const embed = new EmbedBuilder()
                .setTitle('📝 Quiz')
                .setDescription(`**${correctWord.japanese}** (${correctWord.romaji}) kelimesinin anlamı nedir?`)
                .setColor(0x667eea)
                .setFooter({ text: `Seviye: ${level}` });
            
            const row = new ActionRowBuilder();
            options.forEach((opt, index) => {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`quiz_answer_${opt.japanese}_${correctWord.japanese}_${level}_${userId}`)
                        .setLabel(`${index + 1}. ${opt.meaning}`)
                        .setStyle(ButtonStyle.Secondary)
                );
            });
            
            await interaction.update({ embeds: [embed], components: [row] });
        } else {
            // Cevap kontrolü (quiz_answer_SELECTED_CORRECT_LEVEL_USERID)
            const selected = parts[2];
            const correct = parts[3];
            const level = parts[4];
            const isCorrect = selected === correct;
            
            if (isCorrect) {
                // Doğru cevap
                db.run('UPDATE users SET xp = xp + 20 WHERE user_id = ?', [userId]);
                
                const embed = new EmbedBuilder()
                    .setTitle('✅ Doğru!')
                    .setDescription(`Tebrikler! +20 XP kazandınız! 🎉`)
                    .setColor(0x51cf66);
                
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`quiz_next_${level}_${userId}`)
                            .setLabel('➡️ Sonraki Soru')
                            .setStyle(ButtonStyle.Secondary)
                    );
                
                await interaction.update({ embeds: [embed], components: [row] });
            } else {
                // Yanlış cevap
                const correctWord = vocabulary.find(v => v.japanese === correct);
                const embed = new EmbedBuilder()
                    .setTitle('❌ Yanlış!')
                    .setDescription(`Doğru cevap: **${correctWord.meaning}**`)
                    .setColor(0xff6b6b);
                
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`quiz_next_${level}_${userId}`)
                            .setLabel('➡️ Sonraki Soru')
                            .setStyle(ButtonStyle.Secondary)
                    );
                
                await interaction.update({ embeds: [embed], components: [row] });
            }
        }
    }
};
