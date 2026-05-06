<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Password');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'config.php';

$password = $_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? '';

if ($password !== ADMIN_PASSWORD) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'forms':
        $file = DATA_DIR . 'forms.json';
        $forms = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        echo json_encode(array_reverse($forms));
        break;

    case 'ambassadors':
        $file = DATA_DIR . 'ambassadors.json';
        $ambassadors = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        echo json_encode(array_reverse($ambassadors));
        break;

    case 'update-ambassador':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? '';
        $status = $data['status'] ?? '';

        if (!in_array($status, ['accepted', 'rejected', 'pending'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            exit;
        }

        $file = DATA_DIR . 'ambassadors.json';
        $ambassadors = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        foreach ($ambassadors as &$amb) {
            if ($amb['id'] === $id) {
                $amb['status'] = $status;
                break;
            }
        }

        file_put_contents($file, json_encode($ambassadors, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
        break;

    case 'mark-read':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? '';

        $file = DATA_DIR . 'forms.json';
        $forms = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        foreach ($forms as &$form) {
            if ($form['id'] === $id) {
                $form['read'] = true;
                break;
            }
        }

        file_put_contents($file, json_encode($forms, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
        break;

    case 'delete-form':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? '';

        $file = DATA_DIR . 'forms.json';
        $forms = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        $forms = array_values(array_filter($forms, function($f) use ($id) {
            return $f['id'] !== $id;
        }));

        file_put_contents($file, json_encode($forms, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
