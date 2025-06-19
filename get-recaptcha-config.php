<?php
/**
 * Endpoint pentru configurația reCAPTCHA
 * Returnează doar site key-ul pentru frontend
 */

// Încarcă cheile reCAPTCHA din fișier separat
require_once __DIR__ . '/recaptcha_secret.php';

// Setează header-ul pentru JSON
header('Content-Type: application/json');

// Returnează doar site key-ul (nu secret key-ul)
echo json_encode([
    'recaptchaSiteKey' => $recaptcha_site_key
]); 