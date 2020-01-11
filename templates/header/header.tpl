<header class="header w-100">
    <div class="bj-content">
        <div class="row">
            <div class="col-30">
                <a class="svg-absolute bj-logo"  href="{$base_url}">
                    {include_svg file="logo-v.svg"}
                </a>
            </div>
            <div class="col-30">
                <div class="bj-login-panel d-flex align-items-center justify-content-end">
                    {if $admin.authorized}
                        <div class="login-dtl d-flex align-items-center">
                            <span class="user-name twtip" title="Вход выполнен {$admin.login_date}">{$admin.login}</span>
                            <div class="ic-btn ic-btn-yellow d-flex align-items-center logout"> {include_svg file="sign-out.svg"} <span>Выход</span></div>
                        </div>
                    {else}
                        <div onclick="src.modals.show('modal_login')" class="ic-btn ic-btn-yellow d-flex align-items-center"> {include_svg file="sign-in.svg"} <span>Вход</span> </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</header>