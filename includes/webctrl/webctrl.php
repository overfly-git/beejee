<?php

class Webctrl
{
    const WEB_CTRL_MOD_PATH = INCLUDES_PATH . 'webctrl/mods/';
    const SANITIZE_PATTERNS =
    [
        'scripts'       => '@<script[^>]*?>.*?</script>@si',
        'entities'      => '@&#(\d+);@'
    ];

    static $get;
    static $post;
    static $request;

    // route page
    static $pg;

    static $route;

    static $template_variable = [];

    static $route_render_result;

    /* @var  $fenom Fenom */
    static $fenom;

    // request uri
    static $request_uri;

    // work length
    static $measure;

    /* @var $fenom Special */
    static $Special;

    /* @var $Db Db */
    static $Db;

    // create config
    static $config =
    [
        'debug' => false,
        'fenom' =>
        [
            'config' =>
            [
                'disable_methods'  => false,
                'disable_accessor' => false,
                'auto_reload'      => false,
                'force_compile'    => false
            ],
            'template_path' => BASE_PATH . 'templates/'
        ],
        'db' =>
        [
            'host'    => 'localhost',
            'db_name' => '*',
            'user'    => '*',
            'pwd'     => '*',
            'db_char' => 'utf8'
         ],
        'service_key' => 'service',
        '404_redirect' => '/index',

        // admin
        'admin' =>
        [
            'name' => '*',
            'pwd'  => '*' // bcrypt
        ],

        // event
        'on_ready' => null,
        'on_render' => null,

        // mods
        'mods' =>
        [
            'Db' =>
            [
                'class'  => 'Db',
                'config' => [ 'create_manual' => false ]
            ],

            'Special' =>
            [
                'class'  => 'Special',
                'config' => [ 'create_manual' => false ]
            ]
        ]
    ];


    static function create(array $config)
    {
        // start session
        session_start();

        // merge config
        Webctrl::$config  = array_merge(Webctrl::$config, $config);

        Webctrl::$get     = Webctrl::sanitize($_GET, self::SANITIZE_PATTERNS);
        Webctrl::$post    = Webctrl::sanitize($_POST, self::SANITIZE_PATTERNS);
        Webctrl::$request = Webctrl::sanitize($_REQUEST, self::SANITIZE_PATTERNS);

        // get url
        Webctrl::get_request_uri();

        // fenom
        Webctrl::get_fenom();

        // mods
        Webctrl::create_mods();

        // route
        Webctrl::find_route();

        // on_create
        $on_ready = & Webctrl::$config['on_ready'];
        if (is_callable($on_ready))
        {
            call_user_func($on_ready);
        }

        // render
        Webctrl::render();
    }

    static function create_mods()
    {
        try
        {
            $reflectedGlobals = new \ReflectionClass(Webctrl::class);
        } catch (\Exception $e)
        { }

        foreach (Webctrl::$config['mods'] as $name => $options)
        {
            $class_path = strtolower(Webctrl::WEB_CTRL_MOD_PATH . $name . '/' . $name . '.php');
            if (is_callable(Webctrl::class, $name) && file_exists($class_path))
            {
                include $class_path;

                if (class_exists($options['class']) && !$reflectedGlobals->getStaticPropertyValue($name) && $options['create_manual'] !== true)
                {
                    $reflectedGlobals->setStaticPropertyValue($name, new $options['class']($options['config']) );
                }
            }
        }
    }

    static function get_request_uri()
    {
        Webctrl::$request_uri = str_replace('/', '', rawurldecode($_SERVER['REQUEST_URI']));
        Webctrl::$request_uri = BASE_URL . rawurldecode($_SERVER['REQUEST_URI']);

        if (isset(Webctrl::$get['pg']))
        {
            Webctrl::$pg = preg_replace('/\/+$/', '', Webctrl::$get['pg']);
        }

        if (Webctrl::$pg == '')
        {
            Webctrl::$pg = 'index';
        }
    }

    static function get_fenom()
    {
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/ProviderInterface.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Provider.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Accessor.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Compiler.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Modifier.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/RangeIterator.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Render.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Tag.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Template.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Tokenizer.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Error/CompileException.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Error/InvalidUsageException.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Error/SecurityException.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Error/TokenizeException.php';
        include_once Webctrl::WEB_CTRL_MOD_PATH . 'fenom/Fenom/Error/UnexpectedTokenException.php';

        if (!is_dir(CACHE_PATH))
        {
            mkdir(CACHE_PATH);
        }

        Webctrl::$fenom = new Fenom(new Fenom\Provider(Webctrl::$config['fenom']['template_path']));
        Webctrl::$fenom->setCompileDir(CACHE_PATH);

        // debug mode
        if (Webctrl::$config['debug'])
        {
            Webctrl::$config['fenom']['config']['auto_reload'] = true;
        }

        Webctrl::$fenom->setOptions(Webctrl::$config['fenom']['config']);

        // add functions
        Webctrl::$fenom->addFunctionSmart('include_svg', 'Webctrl::fenom_include_svg');
    }

    static function get_validator()
    {
        $mod_autoload = Webctrl::WEB_CTRL_MOD_PATH . 'respect/autoload.php';
        require_once $mod_autoload;
        return Respect\Validation\Validator::create();
    }

    static function find_route()
    {
        Webctrl::$route = Webctrl::$config['route'][Webctrl::$pg];
    }

    static function generate_resource_fields()
    {
        $route_render_result = Webctrl::$route_render_result;

        // title
        if (!empty($route_render_result['title']))
        {
            $current_resource['title'] = $route_render_result['title'];
        }

        // description
        if (!empty($route_render_result['description']))
        {
            $current_resource['description'] = $route_render_result['description'];
        }

        // keywords
        if (!empty($route_render_result['keywords']))
        {
            $current_resource['keywords'] = $route_render_result['keywords'];
        }
        if (!empty(Webctrl::$config['default_keywords']) && empty($current_resource['keywords']))
        {
            $current_resource['keywords'] = Webctrl::$config['default_keywords'];
        }

        // max_scale
        $current_resource['max_scale'] = 1;
        if (!empty($route_render_result['max_scale']))
        {
            $current_resource['max_scale'] = $route_render_result['max_scale'];
        }

        // max_scale
        $current_resource['user_scalable'] = 0;
        if (!empty($route_render_result['user_scalable']))
        {
            $current_resource['user_scalable'] = $route_render_result['user_scalable'];
        }

        // res id
        $current_resource['alias'] = Webctrl::$pg;

        return $current_resource;
    }

    static function template_define($data = null)
    {
        if (is_array($data))
        {
            Webctrl::$template_variable = array_merge(Webctrl::$template_variable, $data);
        }
    }

    /////////////////////////////////
    /// Render
    /////////////////////////////////

    static function render()
    {
        if (Webctrl::$route != null && Webctrl::$pg != Webctrl::$config['service_key'])
        {
            // route key
            $route_key = Webctrl::$pg;

            // render func
            Webctrl::$route_render_result = $route_render_result = call_user_func(Webctrl::$route['render']);


            // define
            // is_mobile
            Webctrl::template_define(['is_mobile' => Webctrl::is_client_mobile()]);
            // site
            Webctrl::template_define(['site' => Webctrl::$config['site']]);
            // request url
            Webctrl::template_define(['request_url' => Webctrl::$request_uri]);
            // res
            Webctrl::template_define(['res' => Webctrl::generate_resource_fields()]);
            // debug
            Webctrl::template_define(['debug' => Webctrl::$config['debug']]);
            // ref
            Webctrl::template_define(['ref' => $_SERVER['HTTP_REFERER']]);
            // base_url
            Webctrl::template_define(['base_url' => BASE_URL]);


            // on_render
            $on_render = & Webctrl::$config['on_render'];
            if (is_callable($on_render))
            {
                call_user_func($on_render);
            }

            // render
            $route_default_idx_tpl = "idx/{$route_key}.tpl";
            $route_idx = Webctrl::$route_render_result['idx_tpl'];

            if (!empty($route_idx) && file_exists(Webctrl::$config['fenom']['template_path'] . $route_idx))
            {
                $route_default_idx_tpl = $route_idx;
            }

            $main_default_tpl = 'main.tpl';
            $main_tpl = Webctrl::$route_render_result['main_tpl'];

            if (!empty($main_tpl) && file_exists(Webctrl::$config['fenom']['template_path'] . $main_tpl))
            {
                $main_default_tpl = $main_tpl;
            }

            Webctrl::template_define(['content' => Webctrl::$fenom->fetch($route_default_idx_tpl, Webctrl::$template_variable)]);


            // final display
            Webctrl::$fenom->display($main_default_tpl, Webctrl::$template_variable);

        } else
        if (Webctrl::$pg == Webctrl::$config['service_key'])
        {
            $action = Webctrl::$request['a'];
            $service_result = [];

            $service_action = & Webctrl::$route[$action];
            if (is_callable($service_action))
            {
                $service_result = call_user_func($service_action);
            }

            header('Content-Type: application/json');
            echo json_encode($service_result);

        } else
        {
            // 404
            //@header("HTTP/1.0 404 Not Found");
            //@header("HTTP/1.1 404 Not Found");
            //@header("Status: 404 Not Found");
            Webctrl::send_redirect(Webctrl::$config['404_redirect']);
        }
    }


    /////////////////////////////////
    /// Fenom functions
    /////////////////////////////////

    static function fenom_include_svg($file, $realpath = false)
    {
        $svg_content  = '';

        if (!empty($file))
        {
            if ($realpath)
            {
                $svg_file = $file;

            } else
            {
                $svg_file = ASSETS_PATH . 'images/' . $file;
            }

            if (is_file($svg_file))
            {
                $svg_content = file_get_contents($svg_file);

            } else
            {
                $svg_content = '<svg style="background: #f5f5f5;"> </svg>';
            }

        } else
        {
            $svg_content = '<svg style="background: #f5f5f5;"> </svg>';
        }

        return "<!--googleoff: all--> {$svg_content} <!--/googleoff: all-->";
    }


    /////////////////////////////////
    /// Utils
    /////////////////////////////////

    static function is_client_mobile()
    {
        $client_size = $_COOKIE['client_size'];

        if ($client_size)
        {
            $client_size = explode('x', $client_size);
            $w = (int)$client_size[0];
            return $w < 768;
        }

        return false;
    }

    static function get_client_ip()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))
        {
            //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];

        } else
        if(!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
        {
            //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            $addr= explode(',', $ip);
            if(isset($addr[1]) && $addr[1])
            {
                $ip= trim($addr[1]);
            }

        } else
        {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

    static function sanitize(array & $target, array $patterns = [], $depth = 99, $nesting = 10)
    {
        foreach ($target as $key => & $value)
        {
            if (is_array($value) && $depth > 0)
            {
                Webctrl::sanitize($value, $patterns, $depth-1);

            } elseif (is_string($value))
            {
                if (!empty($patterns))
                {
                    $iteration = 1;
                    $nesting = ((integer) $nesting ? (integer) $nesting : 10);
                    while ($iteration <= $nesting)
                    {
                        $matched = false;
                        foreach ($patterns as $pattern)
                        {
                            $patternIterator = 1;
                            $patternMatches = preg_match($pattern, $value);
                            if ($patternMatches > 0)
                            {
                                $matched = true;
                                while ($patternMatches > 0 && $patternIterator <= $nesting)
                                {
                                    $value= preg_replace($pattern, '', $value);
                                    $patternMatches = preg_match($pattern, $value);
                                }
                            }
                        }
                        if (!$matched)
                        {
                            break;
                        }
                        $iteration++;
                    }
                }
                if (get_magic_quotes_gpc())
                {
                    $target[$key]= stripslashes($value);
                } else
                {
                    $target[$key]= $value;
                }
            }
        }
        return $target;
    }

    static function send_redirect($location, $exit = true)
    {
        @session_write_close();

        header('Location: ' . $location);

        if ($exit)
        {
            exit(0);
        }
    }
}