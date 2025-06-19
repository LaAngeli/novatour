<?php
/**
 * reCAPTCHA v3 Token Verification
 * 
 * Acest fișier validează token-urile reCAPTCHA v3 conform API-ului oficial
 * și poate fi folosit pentru a proteja formularele și acțiunile
 */

// Încarcă cheile reCAPTCHA din fișier separat
require_once __DIR__ . '/recaptcha_secret.php';

// Funcție pentru validarea token-ului conform API-ului reCAPTCHA v3
function verifyRecaptchaToken($token, $action) {
    global $recaptcha_secret_key;
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $recaptcha_secret_key,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($response === false || $http_code !== 200) {
        logRecaptchaEvent($token, $action, 'ERROR', $_SERVER['REMOTE_ADDR'] ?? '', 'HTTP request failed');
        return false;
    }
    $result = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        logRecaptchaEvent($token, $action, 'ERROR', $_SERVER['REMOTE_ADDR'] ?? '', 'Invalid JSON response');
        return false;
    }
    if (!isset($result['success']) || $result['success'] !== true) {
        $error_codes = $result['error-codes'] ?? [];
        logRecaptchaEvent($token, $action, 'ERROR', $_SERVER['REMOTE_ADDR'] ?? '', 'Token validation failed: ' . implode(', ', $error_codes));
        return false;
    }
    $score = $result['score'] ?? 0;
    $received_action = $result['action'] ?? '';
    if ($received_action !== $action) {
        logRecaptchaEvent($token, $action, $score, $_SERVER['REMOTE_ADDR'] ?? '', 'Action mismatch: expected ' . $action . ', got ' . $received_action);
        return false;
    }
    $hostname = $result['hostname'] ?? '';
    if ($hostname !== 'novatour.md' && $hostname !== 'www.novatour.md') {
        logRecaptchaEvent($token, $action, $score, $_SERVER['REMOTE_ADDR'] ?? '', 'Hostname mismatch: ' . $hostname);
        return false;
    }
    if (isset($result['challenge_ts'])) {
        $challenge_time = strtotime($result['challenge_ts']);
        $current_time = time();
        if ($current_time - $challenge_time > 120) {
            logRecaptchaEvent($token, $action, $score, $_SERVER['REMOTE_ADDR'] ?? '', 'Token expired');
            return false;
        }
    }
    logRecaptchaEvent($token, $action, $score, $_SERVER['REMOTE_ADDR'] ?? '', 'Success');
    return $score;
}

// Funcție pentru a decide acțiunea bazată pe scor
function getActionBasedOnScore($score, $action_type) {
    switch ($action_type) {
        case 'booking':
            return $score >= 0.5;
        case 'contact':
            return $score >= 0.3;
        case 'page_load':
            return true;
        default:
            return $score >= 0.7;
    }
}

// Funcție pentru logging
function logRecaptchaEvent($token, $action, $score, $ip, $message) {
    $log_entry = sprintf(
        "[%s] IP: %s | Action: %s | Score: %s | Message: %s | Token: %s\n",
        date('Y-m-d H:i:s'),
        $ip,
        $action,
        $score,
        $message,
        substr($token, 0, 10) . "..."
    );
    file_put_contents('recaptcha_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
}

// Endpoint pentru verificarea token-urilor
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        $input = json_decode(file_get_contents('php://input'), true);
    } else {
        $input = $_POST;
    }
    $token = $input['token'] ?? '';
    $action = $input['action'] ?? '';
    if (empty($token) || empty($action)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Token și acțiunea sunt obligatorii',
            'error-codes' => ['missing-input-response', 'missing-input-action']
        ]);
        exit;
    }
    $score = verifyRecaptchaToken($token, $action);
    if ($score === false) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Token invalid sau expirat',
            'error-codes' => ['invalid-input-response']
        ]);
        exit;
    }
    $isAllowed = getActionBasedOnScore($score, $action);
    if ($isAllowed) {
        echo json_encode([
            'success' => true,
            'score' => $score,
            'action' => $action,
            'message' => 'Acțiunea este permisă',
            'challenge_ts' => date('c'),
            'hostname' => $_SERVER['HTTP_HOST'] ?? 'novatour.md'
        ]);
    } else {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'score' => $score,
            'action' => $action,
            'message' => 'Acțiunea este blocată din cauza scorului scăzut',
            'error-codes' => ['low-score']
        ]);
    }
} 