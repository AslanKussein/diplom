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
                                    id: "providTableCountLabel",
                                    label: "Количество : ",
                                    width: 120
                                },
                                {
                                    view: "label",
                                    id: "providTableCountLabel",
                                    label: "0",
                                    autowidth: true
                                },
                                {}
                            ]
                        },
                        {
                            view: "datatable",
                            css: "appTable",
                            id: "providersTable",
                            autoheight: true,
                            minHeight: 400,
                            scroll: false,
                            columns: [
                                {id: "id", header: 'ID', width: 120},
                                {id: "name", header: "Наименование товара русский", fillspace: 1}
                            ],
                            select: "row",
                            url: '/diplom/wr/dic?name=providers',
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

                                    $$('providTableCountLabel').setValue(this.count());
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
                                            saveDataValidate('providerForm');
                                        }
                                        },
                                        {
                                            view: "icon", icon: "file-o", css: "buttonIcon", click: function () {
                                            $$('providerForm').clear();
                                        }
                                        },
                                        {
                                            view: "icon", icon: "trash", id: 'trashBtn', disabled: true, css: "buttonIconRed", click: function () {
                                            this.disable();
                                            removeProviders('providerForm', this);
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
                                    id: "providerForm",
                                    elements: [
                                        {view: "text", name: "id", label: " ", hidden: true},
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

        $$('providersTable').attachEvent("onItemClick", function (id, e, node) {
            var item = this.getItem(id);
            if (item) {
                setData(item);
            }
        });

    });
}

function setData(data) {
    var userForm = $$('providerForm');
    userForm.clear();
    userForm.parse(data);
    $$('trashBtn').enable();
}

function saveDataValidate(formName) {
    var form = $$(formName);
    if (form.validate()) {
        var json = JSON.stringify(form.getValues(), null, 1);
        get_ajax('/diplom/wr/dic/saveProviders', 'POST', json, function (gson) {
            if (!gson.result) {
                messageBox('Ошибка', gson.message);
                return;
            }

            if (!form.getValues().id) {
                $$('providersTable').add({id: gson.message.id, name: gson.message.name},0);
            } else {
                $$('providersTable').updateItem(form.getValues().id, gson.message);
            }

            form.clear();
            notifyMessage('Информация ', 'Сведения сохранен', notifyType.info);
        });
    } else {
        notifyMessage('Ошибка валидации! ', '', notifyType.danger);
        return false;
    }
}

function removeProviders(formName, btn) {
    var form = $$(formName);
    get_ajax('/diplom/wr/dic/removeProviders', 'GET', {id: form.getValues().id}, function (gson) {
        if (!gson.result) {
            messageBox('Ошибка', gson.message);
            btn.enable();
            return;
        }
        
        $$('providersTable').remove(form.getValues().id);
        form.clear();
        notifyMessage('Информация ', 'Элемент успешно удален', notifyType.info);
        btn.enable();
    });
}