$(document).ready(function () {
    init();
});
function init() {
    var layout = webix.ui({
        id: "mainlayot",
        container: "mainContainer",
        cols: [
            {
                autowidth: true,
                minWidth: 700,
                margin: 10,
                rows: [

                    {
                        view: "datatable",
                        id: "userDetailTable",
                        autoheight: true,
                        scroll: false,
                        url: "/diplom/wr/user/getUsersDetailList",
                        columns: [
                            {id: "uName", header: "Логин", width: 120},
                            {id: "firstname", header: "Имя", fillspace:1},
                            {id: "lastname", header: "Фамилия", fillspace:1},
                            {id: "middlename", header: "Отчество", fillspace:1},
                            {id: "email", header: "Почта", fillspace:1},
                            {
                                header: " ",
                                id: "block",
                                css: "nonePadding",
                                width: 30
                            },
                            {
                                header: " ",
                                css: "nonePadding",
                                width: 30,
                                template: "<span class='editPerson fa fa-pencil-square-o' style='font-size: 14px;padding: 10px'></span>"
                            }
                        ],
                        scheme: {
                            $init: function (obj) {
                                obj = getBlock(obj);
                            }
                        },
                        onClick: {
                            editPerson: function (e, item, cell) {
                                var id = item.row;
                                var item = this.getItem(id);
                                editUserFormWindow(item);
                            },
                            lockPerson: function (e, item, cell) {
                                var id = item.row;
                                var item = this.getItem(id);
                                lockUser(item, true);
                            },
                            unlockPerson: function (e, item, cell) {
                                var id = item.row;
                                var item = this.getItem(id);
                                lockUser(item, false);
                            }
                        },
                        on: {
                            onAfterLoad: function () {
                                this.hideOverlay();
                                if (!this.count())
                                    this.showOverlay("<span class='no_data_found'>Нет данных для отображения</span>");
 
                            },
                            onBeforeLoad: function () {
                                this.showOverlay('<h5><i class="fa fa-spinner fa-spin"></i><span>&nbsp;Пожалуйста подождите, идет загрузка данных...</span></h5>');
                            }
                        },
                        pager: {
                            container: "userDetailTablePaging",
                            size: 15,
                            group: 10
                        }
                    }, {
                        id: "userDetailTablePaging",
                        view: "template",
                        height: 38,
                        content: "userDetailTablePaging"
                    }
                ]
            }, { width:30},
            {
                view: "form",
                minWidth:450,
                maxWidth:500,
                id: "newLoginForm",
                elementsConfig: {
                    labelPosition: "left",
                    labelWidth: 180
                },
                elements: [
                    {
                        label: "Login",
                        view: "text",
                        name: "uName",
                        required: true
                    }, {
                        height: 1,
                        view: "text",
                        type: "password", 
                        name: "password"
                    }, {
                        label: "Пароль",
                        view: "text",
                        type: "password",
                        name: "newPassword",
                        required: true
                    }, {
                        label: "Подтвердите пароль",
                        view: "text",
                        type: "password",
                        name: "confirmPassword",
                        required: true
                    }, {
                        view: "textarea",
                        label: "Описание",
                        height: 150, 
                        name: "uDesc"
                    }, {
                        cols: [
                            {
                                view: "button",
                                label: "Добавить",
                                width: 130,
                                height: 40,
                                align: 'center',
                                on: {
                                    onItemClick: function (item) {
                                        createUser(this)
                                    }
                                }
                            },
                            {}
                        ]
                    }
                ]
            }
            , {width: 15}
        ]
    });

    webix.event(window, "resize", function () {
        layout.adjust();
    });

}

function createUser(btn) {
    var form = $$("newLoginForm");
    if (form.validate()) {
        btn.disable();
        var json = form.getValues();
        get_ajax('/diplom/wr/admin/createUser', 'POST', {
            uName: json.uName,
            newPass: json.newPassword,
            confirmPass: json.confirmPassword,
            uDesc: json.uDesc
        }, function (gson) {
            btn.enable();
            if (!gson || !gson.result) {
                messageBox('Ошибка', gson.message);
            } else {
                editUserFormWindow(json);
                $$("userDetailTable").parse(json);
            }
        }, function (url) {
            btn.enable();
            messageBox('Ошибка', 'Произошла ошибка службы ' + url);
        });
    } else {
        notifyMessage('Ошибка', 'Заполнены не все поля', notifyType.danger);
    }
}


function editUserFormWindow(gson) {

    if (!$$('newWin')) {
        webix.ui({
            view: "window",
            id: "newWin",
            modal: true,
            position: "center",
            height: 500,
            width: 450,
            on: {
                onHide: function () {
                    window.onscroll = null;
                }
            },
            head: {
                cols: [
                    {width: 10},
                    {
                        view: "label",
                        label: "Редактировать пользователя"
                    },
                    {
                        view: "button", value: "Закрыть", width: 180, height: 34,
                        click: function () {
                            this.getTopParentView().hide();
                            window.onscroll = null;
                        }
                    }
                ]
            },
            body: {
                view: "form",
                id: "editUserForm",
                scroll: false,
                elements: [{
                    rows: [
                        {
                            label: "Login",
                            view: "text",
                            name: "uName",
                            readonly: true
                        },
                        {
                            label: "Имя",
                            view: "text",
                            name: "firstname"
                        },
                        {
                            label: "Фамилия",
                            view: "text",
                            name: "lastname"
                        },
                        {
                            label: "Отчество",
                            view: "text",
                            name: "middlename"
                        },
                        {
                            label: "Почта",
                            view: "text",
                            name: "email"
                        },
                        {height: 10}, 
                        {
                            view: "list",
                            label: "Роли",
                            select: true,
                            height: 150,
                            id: "userRoles",
                            template: "#gDescription#",
                            multiselect: true,
                            url: "/diplom/wr/admin/getGroups"
                        },
                        {height: 10},
                        {
                            cols: [
                                {width: 235},
                                {
                                    view: "button", value: "Сохранить", width: 180, height: 34,
                                    click: function () {
                                        submitEditUserForm();
                                    }
                                }
                            ]
                        }
                    ]
                }],
                elementsConfig: {labelPosition: "left", width: 500, labelAlign: "left"}
            }
        }).hide();
    }
    gson.id = gson.uName;
    $$("userRoles").select(true);
    $$("editUserForm").parse(gson);
    $$("editUserForm").refresh();
    getGroupMembersByUName(gson.uName);
    $$('newWin').show(false, false);
}

function getGroupMembersByUName(uName) {
    get_ajax('/diplom/wr/user/getGroupMembersByUName', 'GET', {
        uName: uName
    }, function (gson) {
        if (gson) {
            var uRoles = [];
            for (var i in gson) {
                uRoles.push(gson[i].id);
            }
            $$("userRoles").select(uRoles);
        }
    }, function (url) {
        messageBox('Ошибка', 'Произошла ошибка службы ' + url);
    });
}


function submitEditUserForm() {
    var form = $$("editUserForm");
    var json = form.getValues();
    var userRoles = $$("userRoles");
    var roles = userRoles.getSelectedItem();
    if (!roles) {
        json.roles = [];
    } else if (!roles.length) {
        json.roles = [];
        json.roles.push(roles)
    } else {
        json.roles = roles;
    }

    get_ajax('/diplom/wr/user/editUser', 'POST', {json: JSON.stringify(json)}, function (gson) {
        if (!gson || !gson.result) {
            messageBox('Ошибка', gson.message);
        } else {
            $$("userDetailTable").parse(json);
            messageBox('Сообщение', 'Пользователь ' + json.uName + ' изменен');
        }
    }, function (url) {
        messageBox('Ошибка', 'Произошла ошибка службы ' + url);
    });
}


function lockUser(item, lock) {
    if (lock) {
        lock = 1;
    } else {
        lock = 0;
    }
    get_ajax('/diplom/wr/admin/lockUser', 'POST', {uName: item.uName, lock: lock}, function (gson) {
        if (!gson.result) {
            messageBox('Ошибка', gson.message);
            return;
        }

        item.locked = lock;
        item = getBlock(item);
        $$("userDetailTable").parse(item);
        $$("userDetailTable").refresh();
        getLockText(item.uName, lock);
    }, null);
}

function getBlock(obj) {
    if (obj.locked == 1) {
        obj.block = "<span class='unlockPerson fa fa-lock' style='font-size: 14px;padding: 10px;color:red;'></span>";
    } else {
        obj.block = "<span class='lockPerson fa fa-unlock-alt' style='font-size: 14px;padding: 10px;color:green;'></span>";
    }
    return obj;
}

function getLockText(uName, lock) {
    if(lock==1) {
        notifyMessage('Информация', 'Пользователь ' +  uName + ' заблокирован', notifyType.danger);
    } else {
        notifyMessage('Информация', 'Пользователь ' +  uName + ' разблокирован', notifyType.info);
    }
}