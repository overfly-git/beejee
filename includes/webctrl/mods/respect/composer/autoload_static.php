<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit980ee0408f6cac0ccb5518c710e3bb5a
{
    public static $files = array (
        '0e6d7bf4a5811bfa5cf40c5ccd6fae6a' => __DIR__ . '/..' . '/symfony/polyfill-mbstring/bootstrap.php',
    );

    public static $prefixLengthsPsr4 = array (
        'S' => 
        array (
            'Symfony\\Polyfill\\Mbstring\\' => 26,
        ),
        'R' => 
        array (
            'Respect\\Validation\\' => 19,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Symfony\\Polyfill\\Mbstring\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/polyfill-mbstring',
        ),
        'Respect\\Validation\\' => 
        array (
            0 => __DIR__ . '/..' . '/respect/validation/library',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit980ee0408f6cac0ccb5518c710e3bb5a::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit980ee0408f6cac0ccb5518c710e3bb5a::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
