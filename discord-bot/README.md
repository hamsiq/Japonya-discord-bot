# 🇯🇵 Japonca Öğren & Japonya Rehberi Discord Botu

Tam kapsamlı **Japonca öğrenme + Japonya rehberi** Discord botu.  
Hiragana / Katakana alfabeleri, JLPT N5–N1 kelime & kanji çalışması, mock sınavlar, mini diyaloglar, kültür notları ve sürekli Japonca sohbet.

## ✨ Özellikler

- 📚 **Alfabeler**: `/hiragana`, `/katakana` ile büyük görselli alfabe tabloları
- 🈳 **Kanji**: JLPT seviyelerine göre kanji öğrenin (N5–N1)
- 📖 **Kelime Öğrenme**: Binlerce etiketlenmiş Japonca kelime
- 🃏 **Flashcard Sistemi**: Spaced repetition ile kelime öğrenme
- 📝 **Quiz & JLPT Mock**: Bilginizi test edin, seviye bazlı deneme sınavları çözün
- 🎓 **Seviye Bazlı Dersler**: N5’ten N1’e kadar ders akışı, pattern + örnek cümlelerle
- 🗣 **Mini Diyaloglar & Sohbet**: Gerçek senaryolar ve botla basit Japonca sohbet
- 🌏 **Japon Kültürü**: Günlük hayat, iş kültürü, seyahat ve görgü kuralları
- 📊 **İstatistikler & XP**: Öğrenme ilerlemenizi takip edin, XP kazanın

## 🚀 Kurulum

### 1. Gereksinimler

- Node.js 16.9.0 veya üzeri
- Discord Bot Token

### 2. Adımlar

```bash
# Klasöre gidin
cd discord-bot

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
cp .env.example .env

# .env dosyasını düzenleyin ve Discord bot token'ınızı ekleyin
# DISCORD_TOKEN=your_bot_token_here
```

### 3. Discord Bot Ayarları

Discord Developer Portal → **Applications → [botun] → Bot**:

- **Privileged Gateway Intents** bölümünde:
  - ✅ `MESSAGE CONTENT INTENT` (Japonca sohbet ve bazı komutlar için gerekli)

### 4. Botu Başlatın

```bash
# Normal mod
npm start

# Geliştirme modu (nodemon ile)
npm run dev
```

## 📋 Komutlar

### 🎓 Dil Öğrenme

- **`/hiragana`** – Hiragana alfabesini büyük bir görselle gösterir.
- **`/katakana`** – Katakana alfabesini büyük bir görselle gösterir.
- **`/vocab level:<N5–N1> sayi:<1–10>`** – Seviye bazlı kelime listesi.
- **`/kanji level:<N5–N1> sayi:<1–5>`** – Seviye bazlı kanji listesi.
- **`/flashcard level:<N5–N1|all>`** – Flashcard ile kelime öğrenimi.
- **`/quiz level:<N5–N1>`** – 4 şıklı kelime quizi (doğrularda XP).
- **`/lesson level:<N5–N1>`** – Seviye bazlı ders (kelime + kanji + pattern + örnek cümleler).
- **`/course level:<N5–N1>`** – O seviyeye uygun çalışma planı.
- **`/jlptmock level:<N5–N1> sayi:<5–20> tur:<mix|vocab|kanji>`** – JLPT tarzı deneme sınavı.
- **`/stats`** – XP, öğrenilen kelime/kanji sayısı, streak bilgisi.

### 🗣 Diyalog & Sohbet

- **`/dialog konu:<cafe|train|konbini|selfintro|restaurant|office|hotel>`**  
  Seçilen konuda mini Japonca diyaloglar (Japonca + romaji + Türkçe).  
  `selfintro` diyaloğunda isim kısmı otomatik olarak sizin adınızla (katakana + Latin) doldurulur.

- **Japonca sohbet (mention)**  
  Bir kanalda botu etiketleyip Japonca/Türkçe karışık bir şey yazarsanız bot size Japonca cevap verir ve sohbeti devam ettirir.

- **`/namejp [isim]`**  
  İsmi Japonca yazılışa çevirir (katakana + hiragana).

### 🌏 Japonya Rehberi & Kültür

- **`/culture [topic]`** – `general | etiquette | daily | work | travel | language`  
  Japon kültürü, görgü kuralları, günlük hayat, iş kültürü, seyahat tüyoları ve dil/keigo hakkında özet bilgiler.

## 🗄️ Veritabanı

Bot SQLite veritabanı kullanır. Otomatik olarak şu tabloları oluşturur:

- `users`: Kullanıcı ilerleme verileri
- `flashcards`: Flashcard tekrar sistemi
- `quiz_scores`: Quiz sonuçları

## 🔧 Yapılandırma

`.env` dosyasında:

- `DISCORD_TOKEN`: Discord bot token'ınız (zorunlu)

## 📝 Notlar

- Bot slash komutları kullanır
- Tüm komutlar Discord'un yeni komut sistemi ile çalışır
- Veritabanı otomatik oluşturulur
- Flashcard sistemi spaced repetition algoritması kullanır

## 🐛 Sorun Giderme

**Bot çalışmıyor:**
- `.env` dosyasında token'ın doğru olduğundan emin olun
- Node.js versiyonunuzun 16.9.0+ olduğunu kontrol edin
- `npm install` komutunu çalıştırdığınızdan emin olun

**Komutlar görünmüyor:**
- Bot'un sunucunuzda olduğundan emin olun
- Bot'a "Applications Commands" yetkisini verin
- Birkaç dakika bekleyin (Discord komutları senkronize etmek için zaman alabilir)

## 📄 Lisans

MIT License - developed by hamsiq

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır! Büyük değişiklikler için önce bir issue açarak neyi değiştirmek istediğinizi tartışın.

## 📞 İletişim

Sorularınız için discord; .hamsiq açabilirsiniz.

---

**Not**: Bu bot eğitim amaçlıdır. Ticari kullanım için lisans kontrolü yapın.
