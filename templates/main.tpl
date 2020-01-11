<!DOCTYPE html>
<html lang="{$site.lkey}">
<head>
    {include "head/head.tpl"}
</head>
<body id="{$res.alias}">

    {* MODALS *}
    {include "modals/modals.tpl"}

    <div class="container-fluid">
        <div class="row">

            {* HEADER *}
            {include "header/header.tpl"}

            {* MAIN*}
            <main class="main w-100 delay-1s animation fade-in" id="animation">
                {$content}
            </main>

            {* FOOTER
            {include file="footer/footer.tpl"}*}

        </div>
    </div>

    {include "head/scripts.tpl"}

</body>
</html>
