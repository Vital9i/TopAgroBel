<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configPath = __DIR__ . '/telegram-config.php';
if (!file_exists($configPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Создайте api/telegram-config.php из api/telegram-config.example.php']);
    exit;
}

$config = require $configPath;
$botToken = trim($config['bot_token'] ?? '');
$chatId = trim($config['chat_id'] ?? '');

if (!$botToken || !$chatId || str_contains($botToken, 'YOUR_')) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Укажите bot_token и chat_id в api/telegram-config.php']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

function tg_escape(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function resolve_lead_page(array $data): string
{
    $page = trim((string)($data['page'] ?? ''));
    if ($page !== '') {
        return $page;
    }

    $map = [
        'home-page' => 'Главная',
        'networks-landing' => 'Сети и благоустройство',
        'floors-landing' => 'Бетонные полы',
        'rental-landing' => 'Аренда техники',
    ];

    $pageKey = trim((string)($data['page_key'] ?? ''));
    if ($pageKey !== '' && isset($map[$pageKey])) {
        return $map[$pageKey];
    }

    return resolve_lead_title($data);
}

function resolve_lead_form_label(array $data): string
{
    return trim((string)($data['form_label'] ?? $data['selected_service'] ?? $data['source'] ?? ''));
}

function resolve_lead_title(array $data): string
{
    $title = trim((string)($data['lead_title'] ?? $data['selected_service'] ?? $data['source'] ?? 'ТопАгроБел'));
    $title = preg_replace('/\s*Источник:\s*.+$/iu', '', $title) ?? $title;
    return $title !== '' ? $title : 'ТопАгроБел';
}

function build_lead_source(array $data): string
{
    $sourceRaw = trim((string)($data['source'] ?? ''));
    $service = trim((string)($data['selected_service'] ?? ''));
    $source = $sourceRaw !== '' ? $sourceRaw : ($service !== '' ? $service : 'ТопАгроБел');
    $source = preg_replace('/\s*Источник:\s*.+$/iu', '', $source) ?? $source;

    $host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? '');
    $isLocalHost = $host === ''
        || $host === 'localhost'
        || $host === '127.0.0.1'
        || $host === '[::1]'
        || $host === '::1'
        || str_ends_with(strtolower($host), '.local');

    if ($host !== '' && !$isLocalHost && stripos($source, $host) === false) {
        $source = $source !== '' ? "{$source} · {$host}" : $host;
    }

    return $source;
}

$name = trim((string)($data['name'] ?? ''));
$phoneRaw = trim((string)($data['phone'] ?? ''));
$phoneDigits = preg_replace('/\D/', '', $phoneRaw);
$workType = trim((string)($data['work_type'] ?? $data['floor_type'] ?? ''));
$area = trim((string)($data['area'] ?? $data['scope'] ?? $data['floor_area'] ?? ''));
$price = trim((string)($data['price_per_m2'] ?? ''));
$total = trim((string)($data['estimated_total'] ?? ''));
$service = trim((string)($data['selected_service'] ?? ''));
$equipment = trim((string)($data['equipment'] ?? ''));
$comment = trim((string)($data['message'] ?? $data['comment'] ?? ''));
$page = resolve_lead_page($data);
$formLabel = resolve_lead_form_label($data);

if (strlen($phoneDigits) < 9) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Укажите корректный телефон']);
  exit;
}

$nameLine = $name !== '' ? tg_escape($name) : 'не указано';
$phoneLine = tg_escape('+' . $phoneDigits);
$pageLine = tg_escape($page);
$time = (new DateTime('now', new DateTimeZone('Europe/Minsk')))->format('d.m.Y H:i');

$message = "🔔 <b>Новая заявка: {$pageLine}</b>\n\n";
$message .= "👤 <b>Имя:</b> {$nameLine}\n";
$message .= "📱 <b>Телефон:</b> {$phoneLine}\n";

if ($formLabel !== '' && $formLabel !== $page) {
    $message .= "📋 <b>Форма:</b> " . tg_escape($formLabel) . "\n";
}

if ($equipment !== '') {
    $message .= "🚜 <b>Техника:</b> " . tg_escape($equipment) . "\n";
}

if ($workType !== '') {
    $message .= "🛠 <b>Тип работ:</b> " . tg_escape($workType) . "\n";
}

if ($area !== '') {
    $message .= "📐 <b>Объём:</b> " . tg_escape($area) . "\n";
}

if ($price !== '') {
    $message .= "💵 <b>Цена:</b> " . tg_escape($price) . " руб./м²\n";
}

if ($total !== '' && is_numeric($total) && (float)$total > 0) {
    $message .= "💰 <b>Ориентир:</b> " . number_format((float)$total, 0, '.', ' ') . " руб.\n";
}

if ($comment !== '') {
    $message .= "💬 <b>Комментарий:</b> " . tg_escape($comment) . "\n";
}

$message .= "🕐 <b>Время:</b> {$time}";

$payload = json_encode([
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
], JSON_UNESCAPED_UNICODE);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $payload,
        'timeout' => 15,
        'ignore_errors' => true,
    ],
]);

$response = file_get_contents("https://api.telegram.org/bot{$botToken}/sendMessage", false, $context);
$result = json_decode($response ?: '', true);

if (!$result || empty($result['ok'])) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => $result['description'] ?? 'Ошибка Telegram API',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
