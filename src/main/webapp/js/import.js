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
                            upload: "/diplom/wr/imp/uploadFile",
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
                        {width: 10},
                        {
                            view: "list", id: "mylist", type: "uploader",
                            autoheight: true, borderless: true
                        }
                    ]
                },
                {height: 40},
                {
                    view: "accordion",
                    multi: true,
                    id: 'mainAccordion',
                    css: 'mainAccordion',
                    margin: 20,
                    rows: []
                }
            ]
        });

        loadData();
    });
}

function loadData() {
    $.ajax({
        url: '/diplom/wr/app/getMainImport',
        type: 'GET',
        success: function (gson) {
            if (gson) {
                createImportAccordion(gson)
            }
             
        },
        error: function () {

        }
    });

}

function createImportAccordion(gson) {
    for (var k in gson) {
        $$('mainAccordion').addView({
            view: "accordionitem",
            header: gson[k].companyName + " " + gson[k].importDate,
            autoheight: true,
            collapsed: true,
            body: {
                rows: [
                    {
                        cols: [
                            {
                                view: "label",
                                align: 'center',
                                label: "Список товаров " + gson[k].companyName + " от " + gson[k].importDate
                            }
                        ]
                    },
                    {
                        id: "srcProducts"+k,
                        view: "search",
                        placeholder: "Введите текст для поиска...",
                        height: 40
                    },
                    {height: 10},
                    {
                        view: "datatable",
                        css: "appTable",
                        id: "productTable" +k,
                        autoheight: true,
                        minHeight: 400,
                        scroll: false,
                        columns: [
                            {id: "id", header: "Код товара", width: 150},
                            {
                                id: "productName", header: [{
                                text: "<div>Наименование товара</div>",
                                css: "multiline",
                                height: 90
                            }], width: 130, fillspace: 1
                            },
                            {
                                id: "productCount", header: [{
                                text: "<div>Количество товара</div>",
                                css: "multiline",
                                height: 90
                            }], width: 130
                            },
                            {
                                id: "unit", header: [{
                                text: "<div>Единица измерения</div>",
                                css: "multiline",
                                height: 90
                            }], width: 130
                            },
                            {
                                id: "price", header: [{
                                text: "<div>Сумма</div>",
                                css: "multiline",
                                height: 90
                            }], width: 130
                            }
                        ],
                        select: "row",
                        url: '/diplom/wr/app/getImportList?provider=' + gson[k].companyName +'&impDate=' + gson[k].importDate,
                        datafetch: 15,
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
                    },
                    {height: 30}
                ]
            }
        });

        $$("srcProducts"+k).attachEvent("onSearchIconClick", function (e) {
            searchProducts("productTable" + k, '/diplom/wr/app/getImportList?provider=' + gson[k].companyName +'&impDate=' + gson[k].importDate+'&srcText='+this.getValue());
        });

        $$("srcProducts"+k).attachEvent("onKeyPress", function (code, e) {
            if (code === 13 && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                searchProducts("productTable" + k, '/diplom/wr/app/getImportList?provider=' + gson[k].companyName +'&impDate=' + gson[k].importDate+'&srcText='+this.getValue());
                return false;
            }
        });
    }
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
       window.location.href = ""
    }
}

function searchProducts(formName, url) {
    $$(formName).clearAll();
    $$(formName).define('url', url);
}