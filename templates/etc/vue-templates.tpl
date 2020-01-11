{* modals-tpl *}
{'<script type="text/x-template" id="modals-tpl">'|lower}
    <div class="modals" :class="{ show : current_modal != '' }">

        {* alert *}
        <div :class="[{ 'md-show': current_modal == 'modal_alert' }, 'md-effect-3' ]" class="md-modal modal_alert" id="modal_alert">
            <div class="md-content">
                <div class="content">
                    <div @click="hide" class="svg-absolute cross svg-visible">{include_svg $file="cross.svg"}</div>
                    <span class="message-cnt" v-html="modal_alert.text"></span>
                    {*<button class="bk-bt bk-btorange" @click="hide">ОК</button>*}
                </div>
            </div>
        </div>

        {* task_add  *}
        <div :class="[{ 'md-show': current_modal == 'modal_task_add' }, effect, { process: modal_task_add.sending } ]" class="md-modal modal_task_add" id="modal_task_add">
            <div class="md-content">

                <loading-box></loading-box>

                <div class="content">
                    <div @click="hide" class="svg-absolute cross svg-visible">{include_svg $file="cross.svg"}</div>

                    <h2 class="bc_bd">Новая задача</h2>

                    <div data-input="name">
                        <text-input ref="tk_name" type="text" id="tk_name" placeholder="Имя"></text-input>
                    </div>

                    <div class="intent-s"></div>

                    <div data-input="email">
                        <text-input ref="tk_email" type="email" id="tk_email" placeholder="E-mail"></text-input>
                    </div>

                    <div class="intent-s"></div>

                    <div data-input="description">
                        <text-input ref="tk_description" type="textarea" id="tk_description" placeholder="Описание задачи"></text-input>
                    </div>

                    <div class="intent-s"></div>

                    <div data-input="comment">
                        <text-input ref="tk_comment" type="textarea" id="tk_comment" placeholder="Комментарии"></text-input>
                    </div>

                    <div class="intent-s"></div>
                    <div class="intent-s"></div>

                    <div data-input="status" class="status-select d-flex justify-content-center align-items-center">
                        <div>
                            <div class="title">Присвоить статус</div>
                            <div class="d-flex statuses">
                                <div title="В процессе" @click="modal_task_add.status = 1" :class="{ active: modal_task_add.status == 1 }" class="svg-absolute bj-status status-1 twtip">{include_svg $file="status-1.svg"}</div>
                                <div title="Выполнено"  @click="modal_task_add.status = 2" :class="{ active: modal_task_add.status == 2 }" class="svg-absolute bj-status status-2 twtip">{include_svg $file="status-2.svg"}</div>
                                <div title="Не выполнено" @click="modal_task_add.status = 3" :class="{ active: modal_task_add.status == 3 }" class="svg-absolute bj-status status-3 twtip">{include_svg $file="status-3.svg"}</div>
                            </div>
                        </div>
                    </div>

                    <div class="intent-s"></div>
                    <div class="intent-s"></div>

                    <div class="text-center ">
                        <div @click="modal_task_add.send" class="btn btn-yellow btn-filled"><span>Добавить</span></div>
                    </div>
                </div>

            </div>
        </div>

        {* login  *}
        <div :class="[{ 'md-show': current_modal == 'modal_login' }, effect, { process: modal_login.sending } ]" class="md-modal modal_login" id="modal_login">
            <div class="md-content">

                <loading-box></loading-box>

                <div class="content">
                    <div @click="hide" class="svg-absolute cross svg-visible">{include_svg $file="cross.svg"}</div>

                    <h2 class="bc_bd">Авторизация</h2>

                    <div data-input="name">
                        <text-input ref="lg_user" type="text" id="tk_user" placeholder="Логин"></text-input>
                    </div>

                    <div class="intent-s"></div>

                    <div data-input="email">
                        <text-input ref="lg_pwd" type="password" id="tk_email" placeholder="Пароль"></text-input>
                    </div>

                    <div class="intent-s"></div>
                    <div class="intent-s"></div>

                    <div class="text-center ">
                        <div @click="modal_login.send" class="btn btn-yellow btn-filled login-send"><span>Войти</span></div>
                    </div>
                </div>

            </div>
        </div>


        <div @click="overlay_click" class="modals-overlay" :class="{ show: current_modal != '' }"></div>

    </div>
{'</script>'|lower}

{* bj-grid-tpl *}
{'<script type="text/x-template" id="grid-tpl">'|lower}
    <div class="bj-grid">
        <table class="bj-table table table-dark"> {* table-striped table-bordered dt-responsive nowrap *}
            <thead>
                <tr>
                    <th class="text-nowrap" :class="'th-' + column.id" v-for="column in task_column" v-if="column.title != ''"><% column.title %></th>
                    <th class="record-tools" v-if="authorized">...</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task_row in tasks_list" :data-id="task_row.id" :data-adminupdate="admin_updated(task_row.id)">
                    <td v-for="(data, index) in task_row">

                        {* id *}
                        <div class="dt-s data-id" v-if="index == 'id'">
                            <span><% data %></span>
                        </div>

                        {* render name *}
                        <div class="dt-s data-name" v-if="index == 'name'"><% data %></div>

                        {* render email *}
                        <div class="dt-s data-string" v-if="index == 'email'"><% data %></div>

                        {* render description *}
                        <div class="dt-s data-description" v-if="index == 'description'"><% data %></div>

                        {* render comment *}
                        <div class="dt-s data-comment" v-if="index == 'comment'"><% data %></div>

                        {* render add_on *}
                        <div class="dt-s data-add_on" v-if="index == 'add_on'"><% date_format(data) %></div>

                        {* render status icon *}
                        <div class="data-status" v-if="index == 'status'">
                            <div v-if="data == 1" title="В процессе"    class="svg-absolute bj-status status-1 twtip">{include_svg $file="status-1.svg"}</div>
                            <div v-if="data == 2" title="Выполнено"     class="svg-absolute bj-status status-2 twtip">{include_svg $file="status-2.svg"}</div>
                            <div v-if="data == 3" title="Не выполнено"  class="svg-absolute bj-status status-3 twtip">{include_svg $file="status-3.svg"}</div>
                        </div>

                    </td>

                    {* render row tools if authorized (туповато передаётся id из за таблицы) *}
                    <td v-for="(data, index) in task_row" v-if="authorized && index == 'id'">
                        <div class="tools-wp d-flex align-items-center">
                            <div @click="task_update(data)" title="Редактировать запись" class="svg-absolute edit twtip">{include_svg $file="edit.svg"}</div>
                            <div @click="task_remove(data)" title="Удалить запись" class="svg-absolute trash twtip">{include_svg $file="trash.svg"}</div>
                        </div>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
{'</script>'|lower}




















