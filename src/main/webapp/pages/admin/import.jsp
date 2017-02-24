<%@ page import="java.util.Date" %>
<%@page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Импорт</title>
    <script src="/aoz/plugin/jquery/jquery-1.11.3.min.js" type="text/javascript"></script>
    <link href="/aoz/css/app.css" rel="stylesheet" type="text/css"/>
    <script src="/aoz/js/locale.js" type="text/javascript"></script>
    <link href="/aoz/plugin/webix/codebase/webix.css" rel="stylesheet" type="text/css"/>
    <script src="/aoz/plugin/webix/codebase/webix.js" type="text/javascript"></script>
    <script src="/aoz/js/import.js" type="text/javascript"></script>
    <script src="/aoz/js/newutils.js?version=<%= new Date()%>" type="text/javascript"></script>
</head>
<body>
<div id="menu">
    <%@include file='/incloudes/menu.jsp' %>
</div>

<div>
    <div class="pagetitle">
        <ul class="breadcrumbs">
            <li><a href="/aoz/">Главная страница</a></li>
            <li class="current"><a>Импорт файла</a></li>
        </ul>
    </div>
    <br>
    <div class="panel panel-default">
        <div class="panel-body">
            <div id="mainContainer"></div>
            <div id="pTablePaging"></div>
        </div>
    </div>
</div>
</body>
</html>
