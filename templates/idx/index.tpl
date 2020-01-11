<div class="pj-tasks">

    <div class="bj-tools">
        <div onclick="src.modals.show('modal_task_add')" class="btn btn-yellow">{include_svg file="more.svg"}<span>Новая задача</span></div>
    </div>

    <div class="bj-content">
        {if $admin.authorized}
            <div class="tutorial">
                <div class="d-flex align-items-center">
                    <i class="twtip" title="строка с background: #ffedae - отредактировано администратором"></i>
                    <span> - отредактировано администратором</span>
                </div>
                <div class="d-flex align-items-center">
                    <i class="twtip bgwt" title="строка с background: #fff - не тронутые записи"></i>
                    <span> - не тронутые записи</span>
                </div>
            </div>
        {/if}

        <div id="grid-wp"></div>

    </div>
</div>