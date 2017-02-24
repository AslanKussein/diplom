function resetPassword() {
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
                        label: "Сменить пароль"
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
                id: "resetPasswordForm",
                scroll: false,
                elements: [
                    {
                        rows: [
                            {
                                height: 1,
                                view: "text",
                                type: "password",
                                name: "password"
                            },
                            {
                                view: "text",
                                label: "Старый пароль",
                                type: "password",
                                name: "oldPassword",
                                required: true
                            }, {
                                label: "Новый пароль",
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
                            },
                            {height: 10},
                            {
                                cols: [
                                    {width: 235},
                                    {
                                        view: "button", value: "Сохранить", width: 180, height: 34,
                                        click: function () {
                                            submitResetPasswordForm();
                                        }
                                    }
                                ]
                            }
                        ]
                    }],
                elementsConfig: {
                    labelPosition: "left",
                    width: 500,
                    labelWidth: 180,
                    labelAlign: "left"
                }
            }
        }).hide();
    }
    $$('newWin').show();
}

function submitResetPasswordForm() {
    var form = $$("resetPasswordForm");
    if (form.validate()) {
        var json = form.getValues();
        get_ajax('/diplom/wr/admin/resetPassword', 'POST', {
            uName: myuser,
            oldPass: json.oldPassword,
            newPass: json.newPassword,
            confirmPass: json.confirmPassword
        }, function (gson) {
            if (!gson || !gson.result) {
                messageBox('Ошибка', gson.message);
            } else {
                messageBox('Информация', 'Пароль успешно изменен');
            }
        }, function (url) {
            messageBox('Ошибка', 'Произошла ошибка службы ' + url);
        });
    } else {
        notifyMessage('Ошибка', 'Заполнены не все поля', notifyType.danger);
    }
}