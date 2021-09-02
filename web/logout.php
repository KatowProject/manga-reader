<?php
session_start([
    'cookie_lifetime' => 86400,
]);
session_destroy();
header('location: /login');
?>