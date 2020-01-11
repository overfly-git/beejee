<?php

// CONST
define('BASE_PATH',      $_SERVER['DOCUMENT_ROOT'] . '/');
define('INCLUDES_PATH',  BASE_PATH . 'includes/');
define('CACHE_PATH',     INCLUDES_PATH . 'cache/');
define('ASSETS_PATH',    BASE_PATH . '/assets/');
define('REQUEST_URI',    $_SERVER['REQUEST_URI']);
define('BASE_URL',       sprintf("%s://%s", isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http', $_SERVER['SERVER_NAME'] ));

