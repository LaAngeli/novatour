# Nova Tour - Transport Internațional de Pasageri

Website oficial pentru serviciile de transport internațional de pasageri din Moldova spre Europa.

[![Website](https://img.shields.io/badge/Website-novatour.md-blue)](https://novatour.md)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-7.4+-purple.svg)](https://php.net)
[![reCAPTCHA](https://img.shields.io/badge/reCAPTCHA-v3-orange.svg)](https://developers.google.com/recaptcha)

## Descriere

Nova Tour oferă servicii de transport internațional de pasageri și colete din Moldova spre cele mai populare destinații europene. Website-ul este optimizat pentru SEO, securizat cu reCAPTCHA v3 și oferă o experiență utilizator modernă și responsivă.

### Caracteristici

- Transport pasageri cu microbuze moderne (Wi-Fi, aer condiționat)
- Transport colete cu livrare garantată
- Destinații: Cehia, Austria, Germania, Belgia, Olanda
- Design responsiv pentru toate dispozitivele
- Protecție reCAPTCHA v3 împotriva boturilor
- Suport multilingv (Română, Rusă)
- Optimizare performanță (cache, compresie, lazy loading)

## Tehnologii

### Frontend
- HTML5 (structură semantică)
- CSS3 (Flexbox, Grid)
- JavaScript ES6+
- Font Awesome (iconuri)

### Backend
- PHP 7.4+
- Apache (mod_rewrite)
- cURL (API communication)

### Securitate
- reCAPTCHA v3 (bot protection)
- HTTPS (SSL/TLS encryption)
- Security Headers (XSS, clickjacking protection)

### SEO & Analytics
- Google Tag Manager
- Schema.org Markup
- Open Graph (social media)
- Hreflang (multilingual SEO)

## Instalare

### Cerințe
- PHP 7.4+
- Apache cu mod_rewrite
- cURL extension
- SSL certificate

### Pași

1. **Clonează repository-ul**
```bash
git clone https://github.com/your-username/nova-tour.git
cd nova-tour
```

2. **Configurează serverul web**
   - Pune fișierele în directorul web
   - Activează `.htaccess`
   - Configurează SSL certificate

3. **Configurează reCAPTCHA**
   - Creează cont pe [Google reCAPTCHA](https://www.google.com/recaptcha)
   - Obține Site Key și Secret Key
   - Actualizează `config.js` și `verify-recaptcha-v3.php`

4. **Configurează Google Tag Manager**
   - Creează cont GTM
   - Înlocuiește `GTM-MMK3G9LX` cu ID-ul tău

## Configurare

### config.js
```javascript
window.NovaTourConfig = {
    recaptchaSiteKey: 'YOUR_SITE_KEY',
    recaptchaVerifyUrl: '/verify-recaptcha-v3.php',
    phoneNumber: '+373XXXXXXXX',
    viberNumber: '+373XXXXXXXX',
    whatsappNumber: '+373XXXXXXXX',
    messengerUrl: 'https://m.me/YOUR_MESSENGER_ID',
    siteUrl: 'https://yourdomain.com',
    siteName: 'Your Site Name',
    gtmId: 'GTM-XXXXXXX'
};
```

### verify-recaptcha-v3.php
```php
$recaptcha_site_key = 'YOUR_SITE_KEY';
$recaptcha_secret_key = 'YOUR_SECRET_KEY';
```

## Structura Proiectului

```
nova-tour/
├── index.html              # Versiunea română
├── index-ru.html           # Versiunea rusă
├── config.js               # Configurare centralizată
├── script.js               # JavaScript principal
├── styles.css              # Stiluri CSS
├── verify-recaptcha-v3.php # Backend reCAPTCHA
├── .htaccess               # Configurare Apache
├── robots.txt              # SEO robots
├── sitemap.xml             # Sitemap XML
├── img/                    # Imagini
│   ├── destinations/       # Imagini destinații
│   ├── flags/             # Steaguri țări
│   └── logo.png           # Logo principal
├── video/                  # Fișiere video
│   ├── video-cover.mp4    # Video principal
│   └── video-cover.webm   # Video WebM
└── README.md              # Documentația
```

## Securitate

### Protecții Implementate
- reCAPTCHA v3 (score-based protection)
- HTTPS redirect (forțează conexiuni securizate)
- Security headers (XSS, clickjacking protection)
- File access control (blochează fișiere sensibile)
- Input validation (validare server-side)
- Rate limiting (protecție spam)

### Fișiere Protejate
- `config.js` - Configurare cu chei
- `verify-recaptcha-v3.php` - Backend logic
- `recaptcha_log.txt` - Log-uri securitate
- `.htaccess` - Configurare server

## SEO și Analytics

### Optimizări SEO
- Meta tags (title, description, keywords)
- Canonical URLs (previne duplicate content)
- Hreflang tags (multilingual SEO)
- Schema.org markup (structured data)
- Open Graph (social media optimization)
- Sitemap XML (indexare Google)

### Analytics
- Google Tag Manager (tracking centralizat)
- reCAPTCHA analytics (monitorizare securitate)
- Performance monitoring (Core Web Vitals)

## Performanță

### Optimizări
- Image optimization (WebP cu fallback)
- Lazy loading (încărcare la cerere)
- CSS/JS minification
- Caching (browser și server)
- Compression (Gzip)
- CDN (Font Awesome)

### Core Web Vitals
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

## Contribuții

Contribuțiile sunt binevenite! Pentru a contribui:

1. Fork repository-ul
2. Creează un branch pentru feature (`git checkout -b feature/AmazingFeature`)
3. Commit schimbările (`git commit -m 'Add some AmazingFeature'`)
4. Push la branch (`git push origin feature/AmazingFeature`)
5. Deschide un Pull Request

### Guidelines
- Respectă standardele de cod
- Testează modificările
- Actualizează documentația
- Verifică securitatea

## Licență

Acest proiect este licențiat sub [MIT License](LICENSE).

## Contact

**Nova Tour**
- Website: [novatour.md](https://novatour.md)
- Telefon: +373 68 399 903
- Viber: +373 68 399 903
- WhatsApp: +373 68 399 903
- Messenger: [m.me/100064945602750](https://m.me/100064945602750)

---

© 2024 Nova Tour. Toate drepturile rezervate.
