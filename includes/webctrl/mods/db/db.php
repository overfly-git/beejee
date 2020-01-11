<?php

// http://phpfaq.ru/pdo/pdo_wrapper

class Db
{
    protected static $instance = null;

    public function __construct() {}

    public static function __callStatic($method, $args)
    {
        return call_user_func_array([self::instance(), $method], $args);
    }

    public static function instance()
    {
        if (self::$instance === null)
        {
            $options  =
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => TRUE,
            ];

            $dsn = 'mysql:host='.Webctrl::$config['db']['host'].';dbname='.Webctrl::$config['db']['db_name'].';charset='.Webctrl::$config['db']['db_char'];

            self::$instance = new PDO($dsn, Webctrl::$config['db']['user'], Webctrl::$config['db']['pwd'], $options);
        }
        return self::$instance;
    }

    public static function run($sql, $args = [])
    {
        if (!$args)
        {
            return self::instance()->query($sql);
        }

        $stmt = self::instance()->prepare($sql);

        $stmt->execute($args);

        return $stmt;
    }
}