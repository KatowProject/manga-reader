<?php
session_destroy();
setcookie('session', '', time() - 3600);
setcookie('username', '', time() - 3600);
setcookie('user_id', '', time() - 3600);

header('location: /login');
?>