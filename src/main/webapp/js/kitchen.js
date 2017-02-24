$(document).ready(function () {
    load();
});

var allPriceTree;
var selectPriceTbl;

var treeData;

function load() {
    webix.ready(function () {
        init();
    })
}


function isLastChild(id) {
    for (var i in treeData) {
        if (treeData[i].parentId == id) {
            return false;
        }
    }
    return true;
}


function mainContainerShow() {
    if ($$("editOrderLayot"))
        $$("editOrderLayot").hide();

    if ($$("mainlayot")) {
        $$("mainlayot").show();
        $$("viewOrderTableWrap").hide();
        $$("ordersTableWrap").show();
    }
    $("#editApp").hide();
    $("#createApp").hide();
    $("#viewApp").hide();
}


function init() {

    var layout = webix.ui({
        id: "mainlayot",
        container: "mainContainer",
        rows: [
            {
                id: "ordersTableWrap",
                autowidth: true,
                minWidth: 450,
                margin: 10,
                rows: [
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                label: "Создать новую заявку",
                                width: 200,
                                click: function () {
                                    editOrder()
                                }
                            }
                        ]
                    },
                    {
                        view: "datatable",
                        id: "ordersTable",
                        minHeight: 500,
                        drag: false,
                        scroll: 'y',
                        hover: "appTableHover",
                        url: "/diplom/wr/kitchen/getOrdersList",
                        rowHeight: 40,
                        columns: [
                            {
                                header: " ",
                                css: "nonePadding",
                                width: 38,
                                template: "<span class='#button# fa #icon#'  ></span>"
                            },
                            {id: "id", header: "id", width: 120, hidden: true},
                            {template: "Заявка № #id#", header: "Наименование", fillspace: 1},
                            {id: "begDate", header: "Начало", width: 120},
                            {id: "endDate", header: "Окончание", width: 120}
                        ],
                        scheme: {
                            $init: function (obj) {
                                obj.icon = " fa-eye";
                                obj.button = "viewOrder";
                                if (isNullOrEmpty(obj.endDate)) {
                                    obj.icon = " fa-pencil-square-o ";
                                    obj.button = "editOrder";
                                }
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
                        onClick: {
                            viewOrder: function (e, item, cell) {
                                var id = item.row;
                                var item = this.getItem(id);
                                viewOrder(item, id);
                            },
                            editOrder: function (e, item, cell) {
                                var id = item.row;
                                var item = this.getItem(id);
                                editOrder(item, id);
                            }
                        },
                        pager: {
                            container: "ordersTablePaging",
                            size: 15,
                            group: 10
                        }
                    }, {
                        id: "ordersTablePaging",
                        view: "template",
                        height: 38,
                        content: "ordersTablePaging"
                    }
                ]
            },
            {
                id: "viewOrderTableWrap",
                autowidth: true,
                hidden: true,
                minWidth: 450,
                margin: 10,
                rows: [
                    {
                        view: "datatable",
                        id: "viewOrderTable",
                        height: 500,
                        drag: true,
                        scroll: 'y',
                        hover: "appTableHover",
                        rowHeight: 40,
                        columns: [
                            {id: "id", header: "Код", width: 120, hidden: true},
                            {id: "code", header: "Код", width: 120},
                            {id: "name", header: "Наименование", fillspace: 1}
                        ],
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
                            container: "viewOrderTablePaging",
                            size: 15,
                            group: 10
                        }
                    }, {
                        id: "viewOrderTablePaging",
                        view: "template",
                        height: 38,
                        content: "viewOrderTablePaging"
                    }
                ]
            }
        ]
    });

    webix.event(window, "resize", function () {
        layout.adjust();
    });

}


function editOrderLayotCreate(id) {
    var layout = webix.ui({
        id: "editOrderLayot",
        container: "editOrderContainer",
        rows: [
            {
                view: "toolbar",
                elements: [
                    {},
                    {
                        view: "icon",
                        icon: "floppy-o",
                        css: "buttonIconGreen",
                        click: function () {
                            saveSelectedProducts();
                        }
                    }
                ],
                elementsConfig: {
                    labelAlign: "right"
                }
            },
            {
                cols: [
                    {
                        autowidth: true,
                        minWidth: 450,
                        margin: 10,
                        rows: [
                            {
                                view: "treetable",
                                scroll: "y",
                                id: "allPriceTree",
                                minHeight: 500,
                                columns: [
                                    {
                                        id: "id",
                                        header: " ",
                                        width: 10,
                                        hidden: true
                                    }, {
                                        id: "name",
                                        header: ["Наименование", {content: "textFilter"}],
                                        sort: "string",
                                        fillspace: 1,
                                        template: "{common.space()} {common.icon()} {common.folder()} #name#"
                                    },
                                    {
                                        header: " ",
                                        css: "nonePadding",
                                        width: 30,
                                        id: "angle"
                                    }
                                ],
                                scheme: {
                                    $init: function (obj) {
                                        if (isLastChild(obj.code) && !isNullOrEmpty(obj.parentId)) {
                                            obj.angle = "<span class='angleRight fa fa-angle-right'  ></span>"
                                        } else {
                                            obj.angle = "";
                                        }
                                    }
                                },
                                onClick: {
                                    angleRight: function (e, item, cell) {
                                        var id = item.row;
                                        var obj = this.getItem(id);
                                        angleRightClick(obj, id)
                                    }
                                }
                            }
                        ]
                    }, {view: "resizer"},
                    {
                        autowidth: true,
                        minWidth: 450,
                        margin: 10,
                        rows: [
                            {
                                view: "datatable",
                                scroll: "y",
                                id: "selectPriceTbl",
                                editable: true,
                                minHeight: 500,
                                columns: [
                                    {
                                        id: "id",
                                        header: " ",
                                        width: 10,
                                        hidden: true
                                    },
                                    {
                                        header: "<span class='angleLeft fa fa-angle-double-left' onclick='angleDoubleLeftClick()'></span>",
                                        css: "nonePadding",
                                        width: 30,
                                        template: "<span class='angleLeft fa fa-angle-left'  ></span>"
                                    },
                                    {
                                        id: "name",
                                        header: ["Наименование", {content: "textFilter"}],
                                        sort: "string",
                                        fillspace: 1,
                                        template: "{common.space()} {common.icon()} {common.folder()} #name#"
                                    },
                                    {
                                        id: "count",
                                        header: " ",
                                        width: 60,
                                        editor: "text"
                                    },
                                    {
                                        header: " ",
                                        width: 40,
                                        template: "#unit.name#"
                                    }
                                ],
                                rules: {
                                    "count": webix.rules.isNotEmpty,
                                    "count": function (value) {
                                        return value > 0
                                    }
                                },
                                onClick: {
                                    angleLeft: function (e, item, cell) {
                                        console.log(e, item, cell);
                                        var id = item.row;
                                        var obj = this.getItem(id);
                                        angleLeftClick(obj, id)
                                    }
                                },
                                scheme: {
                                    $init: function (obj) {
                                        obj.$level = null;
                                        obj.$count = null;
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    });

    allPriceTree = $$("allPriceTree");
    selectPriceTbl = $$("selectPriceTbl");
    webix.event(window, "resize", function () {
        layout.adjust();
    });
    loadDataTree(id);
}

function loadDataTree(id) {
    get_ajax('/diplom/wr/kitchen/getKitchenTreeData', 'GET', {id: id}, function (gson) {
        if (!gson || !gson.result) {
            mainContainerShow();
            messageBox('Ошибка', gson.message);
            return;
        }
        if (gson.order) {
            $$("ordersTable").parse(gson.order);
        }

        if (gson.vProductList) {
            treeData = gson.vProductList.data;
            loadTreeData('allPriceTree', getTreeData(treeData, 'code', 'parentId'));
        }

        if (gson.productList) {
            data = gson.productList.data;
            selectPriceTbl.parse(data);
        }
    });
}

function viewOrder(item, id) {
    $("#createApp").hide();
    $("#editApp").hide();
    $("#viewApp").show();
    $$("viewOrderTableWrap").show();
    $$("ordersTableWrap").hide();
    $$("viewOrderTable").define("url", "/diplom/wr/kitchen/getOrderListById?id=" + id);
}

function editOrder(item, id) {
    $$("mainlayot").hide();
    if (id) {
        $("#editApp").show();
        $("#createApp").hide();
    } else {
        $("#editApp").hide();
        $("#createApp").show();
    }
    $("#viewApp").hide();
    editOrderLayotCreate(id);
}

function angleRightClick(item, id) {
    console.log(item)
    allPriceTree.remove(id);
    selectPriceTbl.parse(item);
}

function angleLeftClick(item, id) {
    console.log(item)
    selectPriceTbl.remove(id);
    allPriceTree.parse(item);
}

function angleDoubleLeftClick() {
    console.log("angleDoubleLeftClick")
}

function saveSelectedProducts() {

    selectPriceTbl.validate()
    /* selectPriceTbl.eachRow(
     function (row) {
     //var obj = selectPriceTbl.getItem(row);
     /!*if (isNullOrEmpty(obj.count)) {
     console.log(obj.name, null)
     }
     console.log(obj)*!/
     }
     )*/
}