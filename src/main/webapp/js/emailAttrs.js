locale();

var selected;

webix.ready(function () {
    webix.ui({
        id: "mainlayout",
        width: 700,
        container: "mainlayout",
        rows: [
            {
                view: "toolbar",
                elements: [
                    {view: "label", label: "Параметры почты"},
                    {
                        view: "icon", icon: "envelope-o", css: "buttonIcon", click: function () {
                        testAttrsWin($$('mainForm'));
                    }
                    },
                    {
                        view: "icon", icon: "floppy-o", css: "buttonIcon", click: function () {
                        saveAttrs($$('mainForm'));
                    }
                    },
                    {
                        view: "icon", icon: "file-o", css: "buttonIcon", click: function () {
                        $$('mainForm').clear();
                    }
                    }
                ]
            },
            {
                view: "form",
                id: "mainForm",
                elements: [
                    {height: 5},
                    {view: "text", name: "id", hidden: true},
                    {view: "text", name: "username", validate: "isEmail", label: "Электронная почта", required: true},
                    {view: "text", type: "password", name: "password", label: "Пароль", required: true},
                    {view: "text", name: "host", label: "Хост", required: true},
                    {view: "text", name: "port", label: "Порт", required: true},
                    {
                        view: "richselect", name: "type", label: "Протокол", required: true, options: [
                        {id: "smtp", value: "SMTP"},
                        {id: "pop3", value: "POP3"},
                        {id: "imap", value: "IMAP"}
                    ]
                    },
                    {height: 15}

                ], elementsConfig: {labelAlign: "right", labelWidth: 200}
            },
            {height: 25},
            {
                view: "toolbar",
                elements: [
                    {view: "label", label: "Шаблоны писем"},
                    {
                        view: "icon",
                        icon: "pencil",
                        id: "templateTableEdit",
                        disabled: true,
                        css: "buttonIcon",
                        click: function () {
                            editTemplateWin();
                        }
                    }
                ]
            },
            {
                id: "templateTable",
                view: "datatable",
                css: "templateTable",
                select: 'row',
                hover: "templateTableHover",
                autoheight: false,
                height: 505,
                rowHeight: 30,
                columns: [
                    {
                        id: "templateTable.code",
                        template: "#code#",
                        header: "Код",
                        width: 90
                    },
                    {
                        id: "templateTable.titleRus",
                        template: "#titleRus#",
                        header: "Заголовок",
                        fillspace: 1
                    }
                ],
                on: {
                    onAfterLoad: function () {
                        this.hideOverlay();

                        if (!this.count())
                            this.showOverlay("<span class='nodatafound'>Нет данных</span>");
                    },
                    onItemClick: function (id, e, trg) {
                        selected = this.getSelectedItem();
                        $$("templateTableEdit").enable();
                    },
                    onItemDblClick: function (id, e, trg) {
                        editTemplateWin();
                    }
                }, pager: "templateTablePager"
            }, {id: "templateTablePager", view: "pager", size: 15}

        ]

    });
    getContent();
});

function getContent() {
    get_ajax('/diplom/wr/mail/getContent', 'GET', {type: "smtp"}, function (gson) {
        if (gson) {
            var mainForm = $$('mainForm');
            mainForm.parse(gson.gsonEmailDetail);
            var templateTable = $$('templateTable');
            templateTable.parse(gson.msgTemplateList);
        }
    });
}

function saveAttrs(form) {
    if (form.validate()) {
        var json = JSON.stringify(form.getValues(), null, 1);
        get_ajax('/diplom/wr/mail/saveAttrs', 'POST', json, function (gson) {
            if (!gson.result) {
                notifyMessage('Ошибка! ', gson.message, 'danger');
                return;
            }

            notifyMessage('Редактирование! ', 'Сведения сохранены.', 'info');
        });
    }
}

function testAttrsWin() {
    var cont_h = $(window).height() - 70;
    var cont_w = $(window).width() - 70;
    if (!$$('testMailFormWin')) {
        webix.ui({
            view: "window",
            id: "testMailFormWin",
            modal: true,
            position: "center",
            height: 400,
            width: 750,
            head: {
                cols: [
                    {width: 10},
                    {view: "label", label: "Тестовая отправка почты"},
                    {
                        borderless: true,
                        view: "toolbar",
                        paddingY: 2,
                        height: 40,
                        cols: [
                            {
                                view: "icon", icon: "fa fa-paper-plane-o", css: "buttonIcon", click: function () {
                                testMailSubmit(this, $$("testMailForm"));
                            }
                            }, {
                                view: "icon", icon: "fa fa-times", css: "buttonIcon", click: function () {
                                    this.getTopParentView().close();
                                    window.onscroll = null;
                                }
                            }
                        ]
                    }
                ]
            },
            body: {
                view: "form",
                id: "testMailForm",
                width: 750,
                elements: [
                    {height: 5},
                    {view: "text", name: "id", hidden: true},
                    {view: "text", validate: "isEmail", name: "username", label: "Электронная почта", required: true},
                    {view: "text", name: "title", label: "Заголовок", required: true},
                    {view: "textarea", name: "text", label: "Текст", required: true, height: 150},
                    {height: 15}

                ], elementsConfig: {labelAlign: "right", labelWidth: 150},
            }
        }).hide();
    }
    $$('testMailFormWin').show(false, false);
    var y = window.scrollY;
    window.onscroll = function () {
        window.scrollTo(0, y);
    };
}


function editTemplateWin() {
    var cont_h = $(window).height() - 70;
    var cont_w = $(window).width() - 70;
    if (!$$('templateWin')) {
        webix.ui({
            view: "window",
            id: "templateWin",
            modal: true,
            position: "center",
            height: 500,
            width: 850,
            head: {
                cols: [
                    {width: 10},
                    {view: "label", label: "Шаблон письма"},
                    {
                        borderless: true,
                        view: "toolbar",
                        paddingY: 2,
                        height: 40,
                        cols: [
                            {
                                view: "icon", icon: "floppy-o", css: "buttonIcon", click: function () {
                                templateWinSubmit(this, $$("templateForm"));
                            }
                            },
                            {
                                view: "icon", icon: "fa fa-times", css: "buttonIcon", click: function () {
                                this.getTopParentView().close();
                                window.onscroll = null;
                            }
                            }
                        ]
                    }
                ]
            },
            body: {
                view: "form",
                id: "templateForm",
                width: 850,
                elements: [
                    {
                        view: "tabview",
                        id: "templateTab",
                        cells: [
                            {
                                header: "RUS",
                                width: 130,
                                id: "templateTabRus",
                                rows: [
                                    {height: 5},
                                    {view: "text", name: "id", hidden: true, value: selected.id},
                                    {view: "text", name: "code", label: "Код", readonly: true, value: selected.code},
                                    {
                                        view: "text",
                                        name: "titleRus",
                                        label: "Заголовок",
                                        required: true,
                                        value: selected.titleRus
                                    },
                                    {
                                        view: "textarea",
                                        name: "templateRus",
                                        label: "Текст",
                                        required: true,
                                        height: 250,
                                        value: selected.templateRus
                                    },
                                    {height: 15}
                                ]
                            },
                            {
                                header: "KAZ",
                                width: 130,
                                id: "templateTabKaz",
                                rows: [
                                    {height: 5},
                                    {view: "text", label: "Код", readonly: true, value: selected.code},
                                    {
                                        view: "text",
                                        name: "titleKaz",
                                        label: "Заголовок",
                                        required: true,
                                        value: selected.titleKaz
                                    },
                                    {
                                        view: "textarea",
                                        name: "templateKaz",
                                        label: "Текст",
                                        required: true,
                                        height: 250,
                                        value: selected.templateKaz
                                    },
                                    {height: 15}
                                ]
                            }
                        ]
                    }


                ], elementsConfig: {labelAlign: "right", labelWidth: 100},
            }
        }).hide();
    }
    $$('templateWin').show(false, false);
    var y = window.scrollY;
    window.onscroll = function () {
        window.scrollTo(0, y);
    };
}

function testMailSubmit(me, form) {
    if (form.validate()) {
        me.disable();
        var json = JSON.stringify(form.getValues(), null, 1);
        get_ajax('/diplom/wr/mail/testMailSubmit', 'POST', json, function (gson) {
            me.enable();
            if (!gson || !gson.result) {
                notifyMessage('Ошибка! ', gson.message, 'danger');
                return;
            }

            notifyMessage('Информация!', 'Сообщение успешно отправлено!', 'info');
        });
    }
}


function templateWinSubmit(me, form) {
    if (form.validate()) {
        var data = form.getValues();
        if (isNullOrEmpty(data.titleRus) || isNullOrEmpty(data.templateRus)) {
            $$('templateTab').setValue('templateTabRus');
            if (!form.validate())
                return;
        }
        if (isNullOrEmpty(data.titleKaz) || isNullOrEmpty(data.templateKaz)) {
            $$('templateTab').setValue('templateTabKaz');
            if (!form.validate())
                return;
        }
        me.disable();
        var json = JSON.stringify(data, null, 1);
        $$("templateTable").parse(json);
        $$("templateTable").refresh();
        get_ajax('/diplom/wr/mail/saveTemplate', 'POST', json, function (gson) {
            me.enable();
            if (!gson || !gson.result) {
                notifyMessage('Ошибка! ', gson.message, 'danger');
                return;
            }

            notifyMessage('Информация! ', 'Изменения сохранены!', 'info');
        });
    }
}