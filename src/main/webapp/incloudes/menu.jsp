<%@ page import="java.util.Date" %>
<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>menu</title>
    <script src="${contextPath}/plugin/bootstrap-3.3.4-dist/js/bootstrap.min.js" type="text/javascript"></script>
    <link href="${contextPath}/plugin/bootswatch-gh-pages/cerulean/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="${contextPath}/plugin/bootstrap-3.3.4-dist/css/bootstrap-menu.css" rel="stylesheet" type="text/css"/>
    <script src="${contextPath}/js/password.js?version=<%= new Date()%>" type="text/javascript"></script>
    <link href="${contextPath}/css/main.css" rel="stylesheet" type="text/css"/>
    <script>
        function logout() {
            $.post("/diplom/auth", function () {
                window.location.href = "/diplom/login.jsp";
            });
        }
    </script>
</head>
<body>
<div style="height: 70px"></div>
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <% if (request.isUserInRole("admin_role")) { %>
            <ul class="nav navbar-nav">

                <li><a href="${contextPath}"><span class="glyphicon glyphicon-home"></span></a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <span>Администрирование</span><span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu" id="mapZhournals">
                        <li><a href="${contextPath}/pages/admin/users.jsp">Пользователи</a></li>
                        <li><a href="${contextPath}/pages/admin/emailattrs.jsp">Параметры почты</a></li>
                    </ul>
                </li>

                <li><a href="${contextPath}/pages/admin/import.jsp">Импорт</a></li>

            </ul>

            <ul class="nav navbar-nav">
                <li class="dropdown light only-icon language-selector ">
                    <a class="dropdown-toggle btn " data-toggle="dropdown" href="#">
                        Справочники&nbsp;<b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu pull-right" style="max-height: 407px;">
                        <li><a href="${contextPath}/pages/admin/importov.jsp">Справочник товаров</a></li>
                        <li><a href="${contextPath}/pages/admin/unit.jsp">Справочник ед. измерении</a></li>
                        <li><a href="${contextPath}/pages/admin/providers.jsp">Справочник Поставщиков</a></li>
                    </ul>
                </li>
            </ul>
            <%}%>

            <ul class="nav navbar-nav navbar-right" id="profilePopup">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"
                       style="padding-left: 45px; width: 190px;">
                        <span id="profileName" style="text-transform: capitalize"></span>
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:resetPassword()">Сменить пароль</a></li>
                        <li><a href="profiles.jsp">Мой профиль</a></li>
                        <%--<li><a href="roles">Мои задачи</a></li>--%>
                        <li class="nav-divider"></li>
                        <li><a href="javascript:void(0)" onclick="logout()"><span
                                class="glyphicon glyphicon-log-out"></span> Выйти</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
<script type="text/javascript">
    $('#profileName').html("<%=request.getRemoteUser()%>");
</script>
</body>
</html>