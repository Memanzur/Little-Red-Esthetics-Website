<?php
// Admin password - change this to whatever Celeste wants
define('ADMIN_PASSWORD', 'Test123!');

// Data directory
define('DATA_DIR', __DIR__ . '/../data/');

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}
