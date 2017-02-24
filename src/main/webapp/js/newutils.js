$.ajaxSetup({
    dataFilter: function (data, type) {
        var match = data.match('<div id="loginMark"/>');
        if (match != null) {
            createLoginWindow();
        } else {
            return data;
        }
    }
});


webix.Date.startOnMonday = true;// что бы первый день недели был понедельник

var notifyType = {
    "info": "alert-info",
    "success": "alert-success",
    "warning": "alert-warning",
    "danger": "alert-danger"
};

function createLoginWindow() {
    if (!$$("loginWindow"))
        webix.ui({
            view: "window",
            id: "loginWindow",
            width: 360,
            position: "center",
            modal: true,
            head: "Авторизация",
            body: {
                id: "loginForm",
                view: "form",
                borderless: true,
                elements: [
                    {view: "text", label: 'Пользователь', name: "username", required: true},
                    {view: "text", label: 'Пароль', name: "password", type: "password", required: true},
                    {
                        cols: [
                            {
                                view: "button", value: "Войти", click: function () {
                                var form = $$('loginForm');

                                if ($$('loginForm').validate()) {
                                    $.ajax({
                                        url: "/diplom/auth",
                                        type: 'GET',
                                        data: {
                                            j_username: form.getValues().username,
                                            j_password: form.getValues().password
                                        },
                                        success: function (gson) {
                                            if (gson) {
                                                if (gson.result) {
                                                    $$('loginWindow').hide();
                                                } else {
                                                    notifyMessage('Ошибка', gson.message, notifyType.danger);
                                                }
                                            }
                                        },
                                        error: function () {
                                            notifyMessage('Ошибка', 'Ошибка сервера', notifyType.danger);
                                        }
                                    });
                                }
                            }
                            },
                            {
                                view: "button", value: "Закрыть", click: function () {
                                $$('loginWindow').hide();
                            }
                            }
                        ]
                    }
                ],
                elementsConfig: {
                    labelPosition: "top"
                }
            }
        }).hide();
    $$("loginWindow").show();
}

function getTreeData(list, field_id, field_parent) {
    var tree = [];
    for (var i in list) {
        if (!list[i][field_parent]) {

            var obj = new Object();

            for (var key in list[i]) {
                var value = list[i][key];
                obj[key] = value;
            }

            var childs = getChild(list, list[i][field_id], field_id, field_parent);

            if (childs.length > 0)
                obj["data"] = childs;

            tree.push(obj);
        }
    }

    return tree;
}

function getChild(list, id, field_id, field_parent) {
    var tree = [];

    for (var i in list) {
        if (list[i][field_parent] == id) {
            var obj = new Object();
            for (var key in list[i]) {
                var value = list[i][key];
                obj[key] = value;
            }

            var childs = getChild(list, list[i][field_id], field_id, field_parent);

            if (childs.length > 0)
                obj["data"] = childs;

            tree.push(obj);
        }
    }

    return tree;
}

function loadFormRichDictionary(form, viewId, data) {
    var list = form.elements[viewId].getPopup().getList();
    list.clearAll();
    list.parse(data);
}

function loadTreeData(viewId, data) {
    $$(viewId).clearAll();
    $$(viewId).parse(data);
}

function setFormElement(form, viewId, data) {
    form.elements[viewId].setValue(data);
}

function getFormElement(form, viewId) {
    return form.elements[viewId].getValue();
}

function getFormRichSelectedItem(form, viewId) {
    var selectedId = getFormElement(form, viewId);
    return form.elements[viewId].getPopup().getList().getItem(selectedId);
}

function setValueBlockEvent(object, value) {
    object.blockEvent();
    object.setValue(value);
    object.unblockEvent();
}

function messageBox(title, text) {
    if (title && text) {
        var len = text.length;
        var width = len * 12;

        if (width > 500)
            width = 500;

        webix.modalbox({
            title: title,
            buttons: ["Ok"],
            text: text,
            width: width
        });
    }
}

function isEmpty(e) {
    if (e != null && e != "")
        return false;
    else
        return true;
}

function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function stringToWebixDate(value) {
    if (value) {
        return stringToDate(value, 'dd.mm.yyyy', '.');
    }

    return null;
}

function getURLParameters(paramName) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf("?") > 0) {
        var arrParams = sURL.split("?");
        var arrURLParams = arrParams[1].split("&");
        var arrParamNames = new Array(arrURLParams.length);
        var arrParamValues = new Array(arrURLParams.length);

        var i = 0;
        for (i = 0; i < arrURLParams.length; i++) {
            var sParam = arrURLParams[i].split("=");
            arrParamNames[i] = sParam[0];
            if (sParam[1] != "")
                arrParamValues[i] = unescape(sParam[1]);
            else
                arrParamValues[i] = "No Value";
        }

        for (i = 0; i < arrURLParams.length; i++) {
            if (arrParamNames[i] == paramName) {
                return arrParamValues[i];
            }
        }
        return null;
    }
}

function blockPage() {
    $$('mainlayot').disable();
}

function unblockPage() {
    $$('mainlayot').disable();
}

function get_ajax(url, type, data, callback, errcallback) {
    $.ajax({
        url: url,
        type: type,
        data: data,
        success: function (gson) {
            callback(gson);
        },
        statusCode: {
            401: function () {
                createLoginWindow();
            }
        },
        error: function () {
            if (errcallback) {
                errcallback(url);
            } else {
                messageBox('Ошибка', 'Произошла ошибка службы ' + url);
            }
        }
    });
}

function get_ajax_sync(url, type, data) {
    return $.ajax({
        url: url,
        type: type,
        data: data,
        async: false
    }).responseJSON;
}

function hide_progress(view) {
    $$(view).hideProgress();
}

function show_progress(view) {
    $$(view).showProgress({
        hide: true
    });
}

function notifyMessage(title, text, cls) {
    if (cls == null || cls == "")cls = notifyType.info;
    $.notify({
            title: title,
            message: text
        },
        {
            template: '<div class="alert ' + cls + '" role="alert"> ' +
            ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '<strong>{1}</strong> {2} &nbsp;&nbsp;</div>'
        });
}


/**
 * @return {boolean}
 */
function IsNumeric(input) {
    return (input - 0) == input && ('' + input).trim().length > 0;
}

function getYearToData(value) {
    if (value) {
        return value.substring(0, value.length - 12);
    } else
        return null;
}


function isNullOrEmpty(e) {
    if (e == null || e == "")
        return true;
    else
        return false;
}

//original http://giorgetti.com.br/blog/2011/12/07/simple-input-mask-using-javascript/
function inputMask(input, mask, key) {
    try {
        var value = input.getValue();

        var newValue = getMask(value, mask, key)
        if (newValue)
            setValueBlockEvent(input, newValue);

    } catch (e) {
        console.log(e)
    }
}



function getMask(value, mask, key) {
    if (isNullOrEmpty(value))return '';
    var literalPattern = /[0\*]/;
    var numberPattern = /[0-9]/;
    var newValue = "";


    // If user pressed DEL or BACK SPACE, clean the value
    try {

        if (key == 46 || key == 8) {
            setValueBlockEvent(input, "");
            return;
        }
    } catch (e1) {
    }

    for (var vId = 0, mId = 0; mId < mask.length;) {
        if (mId >= value.length && key != 0)
            break;
        // Number expected but got a different value, store only the valid portion
        if (mask[mId] == '0' && value[vId].match(numberPattern) == null) {
            break;
        }

        // Found a literal
        while (mask[mId].match(literalPattern) == null) {
            if (value[vId] == null || value[vId] == mask[mId])
                break;

            newValue += mask[mId++];
        }

        newValue += value[vId++];
        mId++;
    }
    return newValue;
}

function loginSubmit(win, username, password) {
    if (isNullOrEmpty(username) || isNullOrEmpty(password)) {
        notifyMessage('Ошибка', "Введите логин и пароль", notifyType.danger);
        return;
    }

    $.ajax({
        url: "/diplom/auth",
        type: 'GET',
        data: {j_username: username, j_password: password},
        success: function (gson) {
            if (gson) {
                if (!gson.result) {
                    notifyMessage('Ошибка', gson.message, notifyType.danger);
                } else {
                    win.hide();
                }
            }
        },
        error: function () {

            notifyMessage('Ошибка', 'Ошибка сервера', notifyType.danger);
        }
    });
}


function isUserInRole(role) {
    return roles.indexOf(role) != -1;
}

function onChangeNumberField(input, v, nullValue, minVal, maxVal) {
    var newV = validNumberValue(v, nullValue);
    if (newV !== v) {
        if (newV < minVal) {
            input.focus();
            return notifyMessage('Ошибка', 'Значение не может быть меньше \'' + minVal + '\'', notifyType.danger);
        }
        if (newV > maxVal) {
            input.focus();
            return notifyMessage('Ошибка', 'Значение не может быть больше \'' + minVal + '\'', notifyType.danger);
        }
        setValueBlockEvent(input, null);
        setValueBlockEvent(input, newV);
    }
}

function validNumberValue(v, nullValue) {
    if (isNullOrEmpty(v)) return nullValue;
    if (webix.rules.isNumber(v)) {
        return parseFloat(v);
    } else {
        v = v.replace(',', '.');
        if (webix.rules.isNumber(v)) {
            return parseFloat(v);
        }
    }

    return nullValue;
}




function datepickerMask(input, mask, key) {
    try {
        var value = input.getValue();

        var newValue = getDateMask(value, mask, key)
        if (newValue)
            setValueBlockEvent(input, newValue);

    } catch (e) {
        console.log(e)
    }
}

function getDateMask(value, mask, key) {
    if (isNullOrEmpty(value))return '';
    var literalPattern = /[0\*]/;
    var numberPattern = /[0-9]/;
    var newValue = "";


    // If user pressed DEL or BACK SPACE, clean the value
    try {

        if (key == 46 || key == 8) {
            setValueBlockEvent(input, "");
            return;
        }
    } catch (e1) {
    }

    for (var vId = 0, mId = 0; mId < mask.length;) {
        if (mId >= value.length && key != 0)
            break;
        // Number expected but got a different value, store only the valid portion
        if (mask[mId] == '0' && value[vId].match(numberPattern) == null) {
            break;
        }

        // Found a literal
        while (mask[mId].match(literalPattern) == null) {
            if (value[vId] == null || value[vId] == mask[mId])
                break;

            newValue += mask[mId++];
        }

        newValue += value[vId++];
        mId++;
    }
    return newValue;
}
