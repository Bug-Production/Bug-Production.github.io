# Bug Production — kurumsal site

Statik (build gerektirmeyen) HTML/CSS/JS sitesi. GitHub Pages, Netlify, cPanel — hepsine olduğu gibi atılabilir.

## Dosya yapısı

```
index.html              Stüdyo ana sayfası (Dead Margin çıkış hero'su + fragman + oyun bantları + stüdyo + topluluk)
dead-margin.html        Oyun sayfası (hero, fragman oynatıcı, 7 sistem sekmeleri, ROKA-OS düşman tarayıcı, galeri, künye)
anatolian-gambit.html   Anatolian Gambit teaser sayfası (altın tema)
press.html              Basın kiti (künyeler, kopyalanabilir metinler, indirilebilir görseller)
404.html                "Sinyal yok" sayfası
assets/css/site.css     Tüm tasarım sistemi (tek dosya)
assets/js/site.js       Dil, menü, reveal, geri sayım, sekmeler, HLS fragman oynatıcı, kamera saati, lightbox, kopyala
assets/img/icons.svg    SVG ikon setinin kaynağı — her sayfanın <body> başına gömülü (<use href="#i-steam">)
assets/img/grunge.png   Logo yıpranma maskesinin kaynağı — site.css içinde data URI olarak (--grunge)
assets/img/Actual-Logo.png  Stüdyo logosunun orijinali (5906×5906, beyaz zemin) — aşağıdakilerin kaynağı
assets/img/logo/        Logodan üretilenler: mark-160 (header), logo-480 (footer), bug-production-logo (basın kiti, şeffaf),
                        logo-512 (kare, beyaz zemin — Google kuruluş logosu / paylaşım önizlemesi), apple-touch-icon
favicon.ico             Favicon (16/32/48 px, logonun güveli paneli)
assets/img/dm/          Dead Margin görselleri (Steam'den indirilmiş yerel kopyalar)
assets/img/scan/        Düşman portreleri (şeffaf PNG)
sitemap.xml             Google için site haritası (sayfalar + görseller)
robots.txt              Tarama izni + sitemap adresi
CNAME                   GitHub Pages özel alan adı (bugdevs.com)
.nojekyll               GitHub Pages'in Jekyll işlemesini kapatır
```

## Tasarım dili (v2 — "Gece Vardiyası")

Benzer oyunların sitelerinden (R.E.P.O./Semiwork, Content Warning/Landfall, Phasmophobia/Kinetic Games,
Abiotic Factor, Deep Rock Galactic/Ghost Ship, Pacific Drive) çıkan ortak kurallar uygulandı:

- **Oyun görseli önde** — hero'da stüdyo tipografisi değil, oyunun key art'ı ve logosu.
- **Oyundan türeyen tek güçlü renk** — logodaki fosfor yeşili (`--neon`); Anatolian Gambit için altın.
- **Oyun içi arayüz dili** — REC/kamera karesi (fragman), ROKA-OS tarayıcı (düşmanlar), HUD kutuları (geri sayım).
- **Fragman sitenin içinde** — Steam'in HLS akışı `hls.js` ile oynatılır; hata olursa Steam sayfası açılır.
- **Stüdyo logosu** — header'da logonun güveli paneli + yazı, footer ve basın kitinde logonun tamamı.
- **Dead Margin logosu** — `.sign` bileşeni: Big Shoulders Stencil + neon parıltı + yıpranma maskesi.
  Gerçek logo PNG'si varsa `.sign` yerine `<img>` konabilir.

Yazı tipleri (Google Fonts, Türkçe destekli): Big Shoulders (başlık), Big Shoulders Stencil (logo),
Barlow (metin), JetBrains Mono (etiket), VT323 (kamera ekranı).

## Yerel önizleme

```bash
npx serve .          # önerilen: /dead-margin gibi uzantısız adresleri GitHub Pages ile aynı çözer
python -m http.server 8788   # alternatif: uzantısız adresi çözmez, /dead-margin.html yazman gerekir
```

Sonra tarayıcıda `http://localhost:3000` (serve) ya da `http://localhost:8788` adresini aç.

> İkon seti ve logo maskesi sayfaya gömülü olduğu için sayfalar file:// ile açıldığında da doğru görünür,
> ama site içi bağlantılar kök-mutlak (`/dead-margin`) olduğundan gezinme yalnızca sunucu üzerinden çalışır.
> `icons.svg` değişirse sayfalardaki gömülü `<svg class="sprite">` bloğunu da güncelle.

> `404.html` her URL derinliğinde çalışsın diye kök-mutlak yollar (`/assets/...`) kullanır;
> bu yüzden yalnızca sunucu üzerinden (localhost veya bugdevs.com) doğru görünür.

## Yayın

- **Repo:** [Bug-Production/Bug-Production.github.io](https://github.com/Bug-Production/Bug-Production.github.io)
- **Adres:** https://bugdevs.com (`www.bugdevs.com` ve `bug-production.github.io` buraya yönlenir)
- **Kaynak:** Settings → Pages → Deploy from a branch → `main` / (root)

`main` dalına yapılan her push birkaç dakika içinde otomatik yayınlanır.

DNS (alan adı sağlayıcısında):

| Kayıt | Ad | Değer |
|---|---|---|
| A | `@` | 185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153 · 2606:50c0:8001::153 · 2606:50c0:8002::153 · 2606:50c0:8003::153 |
| CNAME | `www` | `bug-production.github.io` |

`CNAME` dosyasını silme — GitHub Pages özel alan adını bu dosyadan okur.

## Dil sistemi

İki dil, JS sözlüğü olmadan çalışır: her metin HTML içinde iki kez yazılır.

```html
<span data-lang="tr">Türkçe metin</span><span data-lang="en">English text</span>
```

CSS, aktif olmayan dili gizler (`html[data-site-lang="..."]`). Seçim `localStorage`'a yazılır,
sayfa yüklenirken `<head>` içindeki küçük script ile uygulanır (yanıp sönme olmaz).
Sayfa başlığı ve açıklaması `<meta name="title-tr|title-en|desc-tr|desc-en">` etiketlerinden okunur.

> Not: İngilizce özel isimlerde (Dead Margin, Anatolian Gambit) `lang="en"` kullanıldı;
> aksi halde Türkçe büyük harf kuralı "i" harfini "İ" yapıyor.

## Analitik ve çerez izni

Google Analytics 4 (`G-NFTLWWQ6W1`) **yalnızca ziyaretçi izin verirse** yüklenir; izin verilmeden
Google'a hiçbir istek gitmez ve çerez yazılmaz.

- Her sayfanın `<head>` sonunda Google Consent Mode varsayılanı (`denied`) ve `bpAnalytics(on)` yükleyicisi var.
  Kimlik değişirse beş HTML dosyasındaki `G-NFTLWWQ6W1` değerini güncelle.
- İzin çubuğu `assets/js/site.js` → "12. ÇEREZ İZNİ" bölümünde oluşturulur (metinler de orada, TR/EN).
  Kabul et / Reddet düğmeleri bilerek aynı görünümde.
- Seçim `localStorage` → `bp-consent` (`granted` / `denied`). Seçim yoksa çubuk her sayfada görünür.
- Footer'daki "Çerez tercihleri" (`[data-consent-open]`) çubuğu yeniden açar. Reddedilince
  `_ga` çerezleri silinir ve o sayfadaki ölçüm durdurulur (`ga-disable-…`).
- Test: tarayıcıda `localStorage.removeItem('bp-consent')` → sayfayı yenile.

## Özelleştirme

| Ne | Nerede |
|---|---|
| Renkler, tipografi, boşluklar | `assets/css/site.css` → `:root` bloğu |
| Anatolian Gambit teması (altın) | `body[data-theme="ag"]` |
| Çıkış geri sayımı | `assets/js/site.js` → `TARGET` (18.09.2026 20.00 TSİ) |
| Çıkış anı durumu | Sayacın bittiği an `<html data-released>` + `bp:released` olayı; metin takası `data-rel-pre` / `data-rel-out` |
| Fragman adresleri | `data-src` / `data-trailer` (Steam `hls_264_master.m3u8`) |
| Oyun eklemek | `index.html` → `#oyunlar` içine yeni `.band` |
| Düşman eklemek | `dead-margin.html` → `.scan-stage` içine `.dossier`, `.roster` içine `.r-btn` |

## İletişim ve dış bağlantılar

Sitede tıklanabilir dış bağlantı olarak **yalnızca** şunlar bulunur:

| Ne | Adres | Nerede |
|---|---|---|
| E-posta | `info@bugdevs.com` | topluluk kartı, footer, basın kiti, Anatolian Gambit |
| Discord | https://discord.gg/FtvquKk4A | topluluk kartı, mobil menü, footer |
| Instagram | https://www.instagram.com/bugproductiontr/ | topluluk kartı, mobil menü, footer |
| Steam | https://store.steampowered.com/app/4509530/Dead_Margin/ | istek listesi düğmeleri, footer |

Değiştirmek için: `grep -rn "discord.gg\|instagram.com\|info@bugdevs.com" *.html`
(ana sayfadaki JSON-LD `sameAs` listesi de bu adresleri içerir). Yeni bir dış bağlantı eklemeden önce bu listeyi güncelle.

## Arama motoru (SEO)

- **`sitemap.xml`** — dört sayfa + görseller. Sayfa eklenince buraya da ekle, içerik değişince `<lastmod>` tarihini güncelle.
- **`robots.txt`** — her şeye izin verir ve sitemap'i gösterir.
- **Her sayfanın `<head>`'i** — `canonical`, `robots`, Open Graph (`og:url`, `og:site_name`, görsel boyutları) ve JSON-LD:
  - `index.html`: `Organization` (logo, e-posta, `sameAs`) + `WebSite` (Google'da görünen site adı)
  - `dead-margin.html`: `VideoGame` + `BreadcrumbList`
  - `anatolian-gambit.html`, `press.html`: `BreadcrumbList`
- **Kanonik adresler uzantısızdır** (`https://bugdevs.com/dead-margin`), ana sayfa `https://bugdevs.com/`.
  Dosyalar diskte `.html` olarak durur; GitHub Pages uzantısız adresi aynı dosyayla açar (sondaki `/` çalışmaz: `/dead-margin/` → 404).
  Site içi bağlantılar kök-mutlaktır (`href="/dead-margin"`), `canonical` / `og:url` / JSON-LD / `sitemap.xml` hepsi bu adresi kullanır.
  Eski `.html` bağlantısıyla gelenlerde adres çubuğunu `site.js` içindeki `tidyUrl()` sessizce temizler.
- `<title>` etiketi `title-tr` ile aynı tutulmalı (dil scripti başlığı zaten ona çeviriyor).
- `404.html` bilerek `noindex`; sitemap'te yok.
- Yapısal veriyi test et: https://search.google.com/test/rich-results

**Google Search Console (bir kere yapılır):**

1. https://search.google.com/search-console → *Mülk ekle* → **Alan adı** → `bugdevs.com`.
2. Verilen `google-site-verification=…` TXT kaydını alan adı sağlayıcısında `@` için ekle, *Doğrula*.
3. Sol menü → *Site haritaları* → `sitemap.xml` gönder.
4. *URL denetimi* → `https://bugdevs.com/` → *Dizine eklenmeyi iste* (diğer sayfalar için de tekrarla).
5. GitHub → Settings → Pages → **Enforce HTTPS** açık olmalı.

## Doldurulması gerekenler (TODO)

1. **Konum** — künyede "Türkiye" yazıyor; şehir eklenecekse `press.html` ve footer.
2. **Görseller** — Steam görselleri `assets/img/dm/` altına indirildi. Yüksek çözünürlüklü key art
   veya logo PNG'si varsa aynı isimle değiştirmek yeterli (`keyart.jpg` şu an 1438×810).
3. **Anatolian Gambit** — sayfa şu an bilinçli olarak "duyurulmadı" durumunda.
   Detaylar netleştiğinde `anatolian-gambit.html` içindeki `.redact` alanları doldurulabilir.

## İçerik notu

Dead Margin metinleri, çıkış tarihi (18 Eylül 2026, 20.00 TSİ), dil sayısı ve görseller
Steam mağaza sayfasından (App ID 4509530) alınmıştır. Stüdyo bilgileri:
kuruluş 2025, iki proje. Uydurma istatistik (ekip sayısı, test oyuncusu vb.) kullanılmadı.
