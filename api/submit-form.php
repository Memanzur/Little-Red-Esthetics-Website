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

if (empty($data['firstName']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and email are required']);
    exit;
}

$submission = [
    'id' => uniqid(),
    'firstName' => htmlspecialchars($data['firstName'] ?? ''),
    'lastName' => htmlspecialchars($data['lastName'] ?? ''),
    'email' => htmlspecialchars($data['email'] ?? ''),
    'phone' => htmlspecialchars($data['phone'] ?? ''),
    'service' => htmlspecialchars($data['service'] ?? ''),
    'message' => htmlspecialchars($data['message'] ?? ''),
    'date' => date('Y-m-d H:i:s'),
    'read' => false
];

$file = DATA_DIR . 'forms.json';
$forms = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$forms[] = $submission;
file_put_contents($file, json_encode($forms, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
