<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

if (empty($data['name']) || empty($data['email']) || empty($data['instagram'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and Instagram are required']);
    exit;
}

$submission = [
    'id' => uniqid(),
    'name' => htmlspecialchars($data['name'] ?? ''),
    'email' => htmlspecialchars($data['email'] ?? ''),
    'phone' => htmlspecialchars($data['phone'] ?? ''),
    'instagram' => htmlspecialchars($data['instagram'] ?? ''),
    'why' => htmlspecialchars($data['why'] ?? ''),
    'date' => date('Y-m-d H:i:s'),
    'status' => 'pending'
];

$file = DATA_DIR . 'ambassadors.json';
$ambassadors = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$ambassadors[] = $submission;
file_put_contents($file, json_encode($ambassadors, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'Application submitted successfully']);
