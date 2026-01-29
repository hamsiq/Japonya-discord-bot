const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flashcard')
        .setDescription('Flashcard ile kelime öğren')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('JLPT seviyesi')
                .setRequired(false)
                .addChoices(
                    { name: 'Tümü', value: 'all' },
                    { name: 'N5', value: 'N5' },
                    { name: 'N4', value: 'N4' },
                    { name: 'N3', value: 'N3' },
                    { name: 'N2', value: 'N2' },
                    { name: 'N1', value: 'N1' }
                )),
    
    async execute(interaction, { db, vocabulary }) {
        const level = interaction.options.getString('level') || 'all';
        
        let filtered = level === 'all' 
            ? vocabulary 
            : vocabulary.filter(v => v.level === level);
        
        if (filtered.length === 0) {
            return interaction.reply({ 
                content: '❌ Bu seviyede kelime bulunamadı!', 
                ephemeral: true 
            });
        }
        
        // Rastgele kelime seç
        const word = filtered[Math.floor(Math.random() * filtered.length)];
        
        // Kullanıcı verilerini kontrol et
        const userId = interaction.user.id;
        db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: '❌ Veritabanı hatası!', ephemeral: true });
            }
            
            if (!row) {
                db.run('INSERT INTO users (user_id) VALUES (?)', [userId]);
            }
        });
        
        // Flashcard oluştur (ön yüz - sadece Japonca)
        const embed = new EmbedBuilder()
            .setTitle('🃏 Flashcard')
            .setDescription(`**${word.japanese}**`)
            .addFields(
                { name: 'Romaji', value: word.romaji, inline: true },
                { name: 'Seviye', value: word.level, inline: true }
            )
            .setColor(0x667eea)
            .setFooter({ text: 'Kartı çevirmek için butona tıklayın' });
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`flashcard_flip_${word.japanese}_${level}_${userId}`)
                    .setLabel('🔄 Çevir')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`flashcard_know_${word.japanese}_${level}_${userId}`)
                    .setLabel('✅ Biliyorum')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`flashcard_dontknow_${word.japanese}_${level}_${userId}`)
                    .setLabel('❌ Bilmiyorum')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`flashcard_next_${level}_${userId}`)
                    .setLabel('➡️ Sonraki Kart')
                    .setStyle(ButtonStyle.Secondary)
            );
        
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
            // Sonraki kart göster
            const level = parts[2];
            let filtered = level === 'all' 
                ? vocabulary 
                : vocabulary.filter(v => v.level === level);
            
            if (filtered.length === 0) {
                return interaction.reply({ content: '❌ Bu seviyede kelime bulunamadı!', ephemeral: true });
            }
            
            const word = filtered[Math.floor(Math.random() * filtered.length)];
            
            const embed = new EmbedBuilder()
                .setTitle('🃏 Flashcard')
                .setDescription(`**${word.japanese}**`)
                .addFields(
                    { name: 'Romaji', value: word.romaji, inline: true },
                    { name: 'Seviye', value: word.level, inline: true }
                )
                .setColor(0x667eea)
                .setFooter({ text: 'Kartı çevirmek için butona tıklayın' });
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`flashcard_flip_${word.japanese}_${level}_${userId}`)
                        .setLabel('🔄 Çevir')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`flashcard_know_${word.japanese}_${level}_${userId}`)
                        .setLabel('✅ Biliyorum')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`flashcard_dontknow_${word.japanese}_${level}_${userId}`)
                        .setLabel('❌ Bilmiyorum')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`flashcard_next_${level}_${userId}`)
                        .setLabel('➡️ Sonraki Kart')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await interaction.update({ embeds: [embed], components: [row] });
        } else if (action === 'flip') {
            // Kartı çevir - anlamı göster
            const word = parts[2];
            const level = parts[3];
            const found = vocabulary.find(v => v.japanese === word);
            if (!found) {
                return interaction.reply({ content: '❌ Kelime bulunamadı!', ephemeral: true });
            }
            
            const embed = new EmbedBuilder()
                .setTitle('🃏 Flashcard - Cevap')
                .setDescription(`**${found.japanese}**`)
                .addFields(
                    { name: 'Romaji', value: found.romaji, inline: true },
                    { name: 'Anlam', value: found.meaning, inline: true },
                    { name: 'Seviye', value: found.level, inline: true }
                )
                .setColor(0x51cf66);
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`flashcard_next_${level}_${userId}`)
                        .setLabel('➡️ Sonraki Kart')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await interaction.update({ embeds: [embed], components: [row] });
        } else if (action === 'know') {
            // Kullanıcı biliyor - XP ve ilerleme kaydet
            const word = parts[2];
            const level = parts[3];
            db.run('UPDATE users SET xp = xp + 10, words_learned = words_learned + 1 WHERE user_id = ?', [userId]);
            
            // Sonraki kart butonu ile birlikte mesaj göster
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`flashcard_next_${level}_${userId}`)
                        .setLabel('➡️ Sonraki Kart')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await interaction.update({ 
                content: '✅ Harika! +10 XP kazandınız! 🎉', 
                embeds: [],
                components: [row]
            });
        } else if (action === 'dontknow') {
            // Kullanıcı bilmiyor - flashcard'a ekle (tekrar için)
            const word = parts[2];
            const level = parts[3];
            const found = vocabulary.find(v => v.japanese === word);
            if (found) {
                db.run(`INSERT INTO flashcards (user_id, word_id, level, next_review) 
                        VALUES (?, ?, ?, ?)`,
                    [userId, found.japanese, found.level, Date.now() + 86400000]); // 24 saat sonra
            }
            
            // Sonraki kart butonu ile birlikte mesaj göster
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`flashcard_next_${level}_${userId}`)
                        .setLabel('➡️ Sonraki Kart')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await interaction.update({ 
                content: '📝 Bu kelime tekrar listesine eklendi!', 
                embeds: [],
                components: [row]
            });
        }
    }
};
