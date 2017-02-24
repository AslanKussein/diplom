$(document).ready(function () {
    load();
});

function load() {
    form_init();
}

function form_init() {
    webix.ready(function () {
        var layout = webix.ui({
            id: "mainlayot",
            container: "mainContainer",
            cols: [
                {
                    rows: [
                        {
                            height: 40,
                            cols: [
                                {
                                    view: "label",
                                    id: "unitTableCountLabel",
                                    label: "Количество: ",
                                    width: 105
                                },
                                {
                                    view: "label",
                                    id: "unitTableCountLabel",
                                    label: "0",
                                    autowidth: true
                                },
                                {}
                            ]
                        },
                        {
                            view: "datatable",
                            css: "appTable",
                            id: "unitTable",
                            autoheight: true,
                            minHeight: 400,
                            scroll: false,
                            columns: [
                                {id: "id", header: "Наименование товара английский", fillspace: 1},
                                {id: "name", header: "Наименование товара русский", fillspace: 1}
                            ],
                            select: "row",
                            url: '/aoz/wr/dic?name=unit',
                            pager: {
                                container: "pTablePaging",
                                size: 15,
                                group: 10
                            },
                            on: {
                                onAfterLoad: function () {
                                    this.hideOverlay();
                                    if (!this.count())
                                        this.showOverlay("<span class='no_data_found'>Нет данных для отображения</span>");

                                    $$('unitTableCountLabel').setValue(this.count());
                                },
                                onBeforeLoad: function () {
                                    this.showOverlay('<h5><i class="fa fa-spinner fa-spin"></i><span>&nbsp;Пожалуйста подождите, идет загрузка данных...</span></h5>');
                                }
                            }
                        },
                        {
                            view: "template",
                            height: 50,
                            content: "pTablePaging"
                        }
                    ]
                },
                {view: "resizer"},
                {
                    autoheight: true,
                    rows: [
                        {

                            rows: [
                                {
                                    view: "toolbar",
                                    elements: [
                                        {},
                                        {
                                            view: "icon", icon: "floppy-o", css: "buttonIconGreen", click: function () {
                                            saveDataValidate('unitForm');
                                        }
                                        },
                                        {
                                            view: "icon", icon: "file-o", css: "buttonIcon", click: function () {
                                            $$('unitForm').clear();
                                        }
                                        },
                                        {
                                            view: "icon", icon: "trash", id: 'trashBtn', disabled: true, css: "buttonIconRed", click: function () {
                                            this.disable();
                                            removeUnit('unitForm', this);
                                        }
                                        }
                                    ],
                                    elementsConfig: {
                                        labelAlign: "right"
                                    }
                                },
                                {
                                    id: "test",
                                    rows: []
                                },
                                {
                                    width: 350,
                                    view: "form",
                                    id: "unitForm",
                                    elements: [
                                        {
                                            view: "text",
                                            name: "id",
                                            label: "Наименования на английском",
                                            attributes: {maxlength: 11},
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            name: "name",
                                            label: "Наименования на русском",
                                            required: true
                                        }
                                    ],
                                    elementsConfig: {labelPosition: "top", labelAlign: "left"}
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        $$('unitTable').attachEvent("onItemClick", function (id, e, node) {
            var item = this.getItem(id);
            if (item) {
                setUserData(item);
            }
        });

    });
}

function setUserData(data) {
    $$('trashBtn').enable();
    var userForm = $$('unitForm');
    userForm.clear();
    userForm.parse(data);
}

function saveDataValidate(formName) {
    var form = $$(formName);
    if (form.validate()) {
        var json = JSON.stringify(form.getValues(), null, 1);
        get_ajax('/diplom/wr/dic/saveUnit', 'POST', json, function (gson) {
            if (!gson.result) {
                messageBox('Ошибка', gson.message);
                return;
            }

            $$('unitTable').define('url', '/aoz/wr/dic?name=unit');

            form.clear();
            notifyMessage('Информация ', 'Сведения сохранен', notifyType.info);
        });
    } else {
        notifyMessage('Ошибка валидации! ', '', notifyType.danger);
        return false;
    }
}

function removeUnit(formName, btn) {
    var form = $$(formName);
    get_ajax('/diplom/wr/dic/removeUnit', 'GET', {id: form.getValues().id}, function (gson) {
        if (!gson.result) {
            messageBox('Ошибка', gson.message);
            btn.enable();
            return;
        }

        $$('unitTable').remove(form.getValues().id);
        form.clear();
        btn.enable();
        notifyMessage('Информация ', 'Элемент успешно удален', notifyType.info);
    });
}