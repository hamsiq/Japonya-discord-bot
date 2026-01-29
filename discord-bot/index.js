const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // Japonca sohbet için mesaj içeriğine erişmek gerekiyor.
        // LÜTFEN Discord Developer Portal > Bot > Privileged Gateway Intents
        // bölümünden "MESSAGE CONTENT INTENT" seçeneğini AÇ.
        GatewayIntentBits.MessageContent
    ]
});

// Komut koleksiyonu
client.commands = new Collection();

// Komutları yükle
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Veri dosyalarını yükle
const hiragana = require('./data/hiragana');
const katakana = require('./data/katakana');
const vocabulary = require('./data/vocabulary');
const kanji = require('./data/kanji');

// Database
const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_PATH || './data/database.db';
const db = new sqlite3.Database(dbPath);

// Database tablolarını oluştur
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        level TEXT DEFAULT 'N5',
        xp INTEGER DEFAULT 0,
        words_learned INTEGER DEFAULT 0,
        kanji_learned INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        last_study_date TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        word_id TEXT,
        level TEXT,
        next_review INTEGER,
        ease_factor REAL DEFAULT 2.5,
        review_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS quiz_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        level TEXT,
        score INTEGER,
        total INTEGER,
        date TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
});

// Bot hazır olduğunda
client.once('ready', () => {
    console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
    console.log(`📚 ${client.commands.size} komut yüklendi`);
    
    // Bot durumunu ayarla
    client.user.setPresence({
        activities: [{ name: ' developed by hamsiq', type: 3 }], // 3 = WATCHING
        status: 'dnd' // dnd = Do Not Disturb (Rahatsız Etme)
    });
    
    // Eski global slash komutlarını temizle (çift görünmesin)
    client.application.commands.set([]).then(() => {
        console.log('✅ Global slash komutları temizlendi');
    }).catch(err => {
        console.error('Global komutlar temizlenemedi:', err.message);
    });

    // Slash komutlarını kaydet (sadece sunucuya özel - anında görünür)
    const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    
    // Sunucuya özel komutlar (anında görünür) - tüm sunucular için
    client.guilds.cache.forEach(guild => {
        guild.commands.set(commands).then(() => {
            console.log(`✅ ${guild.name} sunucusuna komutlar kaydedildi!`);
        }).catch(err => {
            console.error(`${guild.name} sunucusunda hata:`, err.message);
        });
    });
});

// Slash komut işleyicisi
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, { db, hiragana, katakana, vocabulary, kanji });
    } catch (error) {
        console.error(error);
        await interaction.reply({ 
            content: '❌ Bu komutu çalıştırırken bir hata oluştu!', 
            ephemeral: true 
        });
    }
});

// Button interaction handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    // Flashcard butonları için
    if (interaction.customId.startsWith('flashcard_')) {
        const command = client.commands.get('flashcard');
        if (command && command.handleButton) {
            await command.handleButton(interaction, { db, vocabulary });
        }
    }
    
    // Quiz butonları için
    if (interaction.customId.startsWith('quiz_')) {
        const command = client.commands.get('quiz');
        if (command && command.handleButton) {
            await command.handleButton(interaction, { db, vocabulary });
        }
        }

        // JLPT mock butonları için
        if (interaction.customId.startsWith('jlpt_')) {
            const command = client.commands.get('jlptmock');
            if (command && command.handleButton) {
                await command.handleButton(interaction, { db, vocabulary, kanji });
            }
    }
});

// Japonca küçük sohbet – bot etiketlenince cevap verir
client.on('messageCreate', async (message) => {
    // Bot mesajlarına veya DM'lere cevap verme
    if (message.author.bot) return;
    if (!message.inGuild?.()) return;

    // Bot etiketlenmemişse çık
    if (!message.mentions.has(client.user)) return;

    // Etiketi metinden çıkar
    const raw = message.content.replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '').trim();
    const text = raw || '';

    const lower = text.toLowerCase();

    let reply;

    // Basit selamlar
    if (text.includes('こんにちは') || text.includes('こんちは') || lower.includes('merhaba')) {
        reply = 'こんにちは！元気？（Nasılsın?）';
    } else if (text.includes('元気') || lower.includes('nasılsın')) {
        reply = 'わたしは元気だよ！ハムシクさんは？（Ben iyiyim, ya sen?）';
    } else if (text.includes('おはよう') || lower.includes('gunaydin') || lower.includes('günaydın')) {
        reply = 'おはようございます！今日は何をしますか？（Bugün ne yapacaksın?）';
    } else if (text.includes('こんばんは')) {
        reply = 'こんばんは！一日どうでしたか？（Günün nasıldı?）';
    } else if (text.includes('ありがとう')) {
        reply = 'どういたしまして！こちらこそ、ありがとう〜 🙌';
    }

    // Eğer özel bir eşleşme yoksa, genel bir sohbet cevabı ver
    if (!reply) {
        // Birkaç rastgele cevap şablonu
        const templates = [
            (t) => `いいね！「${t || 'その話'}」についてもっと教えて〜（Devam etsene, merak ediyorum）`,
            (t) => `それは面白いね！普段は日本語の勉強をどうやってる？（Genelde Japoncayı nasıl çalışıyorsun?）`,
            (t) => `なるほど〜。じゃあ、好きなアニメやドラマはある？（Sevdiğin anime/dizi var mı?）`
        ];
        const fn = templates[Math.floor(Math.random() * templates.length)];
        reply = fn(text);
    }

    await message.reply(reply);
});

// Hata yönetimi
client.on('error', console.error);
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Botu başlat
client.login(process.env.DISCORD_TOKEN);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Bot kapatılıyor...');
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('✅ Database bağlantısı kapatıldı.');
    });
    client.destroy();
    process.exit(0);
});

module.exports = { client, db };
