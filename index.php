<?php

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);

require 'includes/webctrl/webctrl.constants.php';
require 'includes/webctrl/webctrl.php';

Webctrl::create([

    'debug' => true,

    'site' =>
    [
        'name' => 'BeeJee Testwork',
    ],

    'db' =>
    [
        'host'    => 'localhost',
        'db_name' => 'bee_db',
        'user'    => 'sql_user',
        'pwd'     => 'ewferrY$w5tghtw4fregq34qfa',
        'db_char' => 'utf8'
    ],

    'admin' =>
    [
        'name' => 'admin',
        'pwd'  => '$2y$10$SmjtKURHx/kTolrDs7qkIOXovMU/kslIWN.PeDChxWVGRHDBQXuuG'  //TODO remove 123
    ],

    'on_ready' => function()
    {
        // define vars for all tpl
        Webctrl::template_define([
            'cache_disable_val' => Webctrl::$config['debug'] ? rand(0, 10000) : 1,
            'admin' =>
            [
                'authorized' => $_SESSION['auth.authorized'],
                'login_date' => $_SESSION['auth.login_date'],
                'login' => $_SESSION['auth.name'],
            ]
        ]);
    },

    'route' =>
    [
        //////////
        // RENDER
        //////////
        'index' =>
        [
            'render' => function()
            {
                Webctrl::template_define([
                    'task_list'    => Webctrl::$Special->get_tasks(),
                    'task_updated' => Webctrl::$Special->get_updated_tasks(),
                    'task_column'  => Webctrl::$Special->get_tasks_columns(),
                ]);

                return
                [
                    'title' => 'Главная',
                    'idx_tpl' => 'idx/index.tpl',
                ];
            }
        ],

        ///////////
        // SERVICE
        ///////////
        'service' =>
        [
            'test' => function()
            {
                return [];
            }
            ,
            'task_add' => function()
            {
                $validator = Webctrl::get_validator();

                $errors = [];

                $is_name         = $validator::stringType()->regex('/^[A-Za-zА-Яа-яЁё ]{2,60}$/u')->validate( Webctrl::$post['name'] );
                $is_email        = $validator::email()->validate(Webctrl::$post['email']);
                $is_description  = $validator::stringType()->notEmpty()->validate( Webctrl::$post['description'] );
                $is_status       = $validator::intVal()->validate( Webctrl::$post['status'] );

                if (!$is_name)
                {
                    $errors[] = ['name' => 'Неверный формат'];
                }
                if (!$is_email)
                {
                    $errors[] = ['email' => 'Неверный формат'];
                }
                if (!$is_status)
                {
                    $errors[] = ['status' => 'Неверный формат'];
                }

                if (!$is_description)
                {
                    $errors[] = ['description' => 'Неверный формат'];
                }
                if (count($errors) > 0)
                {
                    return ['ok' => 0, 'e' => $errors];
                }

                $task_added = Webctrl::$Special->task_update(Webctrl::$post);

                return ['ok' => 1, 'i' => $task_added];
            }
            ,
            'task_remove' => function()
            {
                $task_removed = Webctrl::$Special->task_remove(Webctrl::$post['id']);
                return ['ok' => 1, 'i' => $task_removed];
            }
            ,
            'login' => function()
            {
                $user = Webctrl::$post['user'];
                $pwd  = Webctrl::$post['pwd'];

                $login = Webctrl::$Special->login($user, $pwd);

                return ['ok' => (int)$login];
            }
            ,
            'logout' => function()
            {
                Webctrl::$Special->logout();
                return ['ok' => 1];
            }
        ]
    ]

]);