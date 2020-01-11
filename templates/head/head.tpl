<base href="{$base_url}">
<meta charset="UTF-8">
<!--[if IE]>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<![endif]-->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale={$res.max_scale}, user-scalable={$res.user_scalable}">
<meta http-equiv="Content-language" content="ru">

<meta name="description" content="{$res.description}">
<meta name="keywords" content="{$res.keywords}">
<meta name="format-detection" content="telephone=no">

{* og
<meta property="og:title" content="{$og.title}">
<meta property="og:description" content="{$og.description}">
<meta property="og:image" content="{$og.image}">
<meta property="og:type" content="article">
<meta property="og:url" content="{$request_url}">
<meta property="og:site_name" content=""> *}

{* icons *}
<link rel="apple-touch-icon" sizes="180x180" href="assets/ic/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="assets/ic/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/ic/favicon-16x16.png">
<link rel="manifest" href="assets/ic/site.webmanifest">
<link rel="mask-icon" href="assets/ic/safari-pinned-tab.svg" color="#5bbad5">
<link rel="shortcut icon" href="assets/ic/favicon.ico">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="msapplication-config" content="assets/ic/browserconfig.xml">
<meta name="theme-color" content="#ffffff">

{* css *}
<link href="//cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css" media="all" rel="stylesheet">
<link href="assets/bootstrap/css/bootstrap.min.css" media="all" rel="stylesheet">
<link href="assets/fonts/fonts.css" media="all" rel="stylesheet">
<link href="assets/modals_ef.min.css" media="all" rel="stylesheet">
<link href="assets/swiper/css/swiper.min.css" media="all" rel="stylesheet">
<link href="assets/awesome.min.css" media="all" rel="stylesheet">
<link href="//cdn.datatables.net/1.10.20/css/dataTables.bootstrap4.min.css" media="all" rel="stylesheet">
<link href="assets/style.css?{$cache_disable_val}" media="all" rel="stylesheet">


<script>
    var src_config =
    {
        service: "service/",
        lex: { },
        task_list: {$task_list|json_encode},
        task_updated: {$task_updated|json_encode},
        task_column: {$task_column|json_encode},
        authorized: {$admin.authorized|intval}
    };

</script>


<title>{$site.name} | {$res.title}</title>