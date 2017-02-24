$(document).ready(function () {
    load();
});

function load() {
    form_init();
}

function form_init() {
    var relDic = loadDictionaries();
    webix.ready(function () {
        var layout = webix.ui({
            id: "mainlayot",
            container: "mainContainer",
            cols: [
                {
                    rows: [
                        {
                            cols: [
                                {
                                    id: "upl1",
                                    view: "uploader",
                                    label: "Загрузить",
                                    width: 130,
                                    height: 40,
                                    align: 'center',
                                    multiple: false,
                                    link: "mylist",
                                    upload: "/diplom/wr/imp/uploadFileTov",
                                    on: {
                                        onBeforeFileAdd: function (item) {

                                        },
                                        onAfterFileAdd: function (item) {

                                        },
                                        onUploadComplete: function (response) {
                                            uploadComplete(response);
                                        }
                                    }
                                },
                                {
                                    view: "list", id: "mylist", type: "uploader",
                                    autoheight: true, borderless: true
                                }
                            ]
                        },
                        {
                            view: "treetable",
                            select: true,
                            scroll: "y",
                            id: "dDicTreeMain",
                            autoheight: true,
                            minHeight: 565,
                            columns: [
                                {
                                    id: "ch1",
                                    header: "",
                                    template: "{common.checkbox()}",
                                    css: "ch1",
                                    width: 50,
                                    hidden: true
                                },
                                {
                                    id: "productName",
                                    header: ["Наименование", {content: "textFilter"}],
                                    sort: "string",
                                    fillspace: 1,
                                    template: "{common.space()} {common.icon()} {common.folder()} #productName#"
                                },
                                {id: "unitId", hidden: true, header: "ед. Измерения", sort: "string", width: 60}
                            ],
                            on: {
                                onItemClick: function (e) {
                                    var item = this.getSelectedItem();
                                    $$('productForm').parse(item);
                                    $$('dDic').setValue(item.id);
                                    $$('unitDic').setValue(item.unitId)
                                    $$('trashBtn').enable();
                                }
                            }
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
                                            saveDataValidate('productForm');
                                        }
                                        },
                                        {
                                            view: "icon", icon: "file-o", css: "buttonIcon", click: function () {
                                            $$('productForm').clear();
                                        }
                                        },
                                        {
                                            view: "icon", icon: "trash", id: 'trashBtn', disabled: true, css: "buttonIconRed", click: function () {
                                            this.enable();
                                            removeProduct('productForm', this);
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
                                    id: "productForm",
                                    elements: [
                                        {
                                            view: "text",
                                            name: "code",
                                            label: "CODE",
                                            attributes: {maxlength: 11},
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            name: "productName",
                                            label: "Имя продукта",
                                            required: true
                                        },
                                        {
                                            view: "richselect",
                                            id: "unitDic",
                                            name: "unitId",
                                            required: true,
                                            label: "Единица измерения",
                                            suggest: {
                                                body: {template: "#name#", data: relDic}
                                            }
                                        },
                                        {
                                            view: "combo",
                                            label: "ID родителя",
                                            id: "dDic",
                                            name: "parentId",
                                            suggest: {
                                                template: "#productName#",
                                                body: {
                                                    view: "tree",
                                                    height: 350,
                                                    scroll: "y",
                                                    id: "dDicTree",
                                                    css: "combotree",
                                                    template: "{common.icon()} {common.folder()}#productName#"
                                                }
                                            }
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

        $$('dDicTreeMain').filterByAll = function () {
            var title = this.getFilter("productName").value;
            if (!title)
                return this.filter();
            this.filter(function (obj) {
                if (obj.productName.toLowerCase().indexOf(title) != -1)
                    return true;
                return false;
            });
        };

        loadDataTree();
    });
}

function loadDataTree() {
    get_ajax('/diplom/wr/dic?name=productsList', 'GET', {}, function (gson) {
        if (gson) {
            loadTreeData('dDicTreeMain', getTreeData(gson, 'code', 'parentId'));
            loadTreeData('dDicTree', getTreeData(gson, 'code', 'parentId'));
        }
    });
}

function loadDictionaries() {
    return get_ajax_sync('/aoz/wr/dic?name=unit', 'GET', {});
}


function uploadComplete(response) {
    if (response.result) {
        messageBox('Сообщение', 'Файл импортирован');
    } else {
        if (response.resultText) {
            messageBox('Ошибка импорта', response.resultText);
        } else {
            messageBox('Ошибка импорта', "Файл небыл загружен, так как имеет ошибки");
        }
    }

    if (response.resultData) {
        loadDataTree();
    }
}

function saveDataValidate(formName) {
    var form = $$(formName);
    if (form.getValues().code.length == 11) {
        if (form.validate()) {
            var json = JSON.stringify(form.getValues(), null, 1);
            get_ajax('/diplom/wr/dic/saveProducts', 'POST', json, function (gson) {
                if (!gson.result) {
                    messageBox('Ошибка', gson.message);
                    return;
                }

                if (!form.getValues().id) {
                    $$('dDicTreeMain').add(gson.message, 0, gson.message.parentId);
                    $$('dDicTree').add(gson.message, 0, gson.message.parentId);
                } else {
                    $$('dDicTreeMain').updateItem(form.getValues().id, gson.message.parentId);
                }

                form.clear();
                notifyMessage('Информация ', 'Сведения сохранен', notifyType.info);
            });
        } else {
            notifyMessage('Ошибка валидации! ', '', notifyType.danger);
            return false;
        }
        return false;
    } else {
        notifyMessage('Ошибка валидации! ', 'Длина code меньше 11', notifyType.danger);
        return false;
    }
}

function removeProduct(formName, btn) {
    var form = $$(formName);

    get_ajax('/diplom/wr/dic/removeProducts', 'POST', form.getValues().id, function (gson) {
        if (!gson.result) {
            messageBox('Ошибка', gson.message);
            btn.enable();
            return;
        }

        $$('dDicTreeMain').remove(form.getValues().id);
        form.clear();
        btn.enable();
        notifyMessage('Информация ', 'Элемент успешно удален', notifyType.info);
    });
}