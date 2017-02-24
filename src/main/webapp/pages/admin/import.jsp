<%@ page import="java.util.Date" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<%@page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Импорт</title>
    <script src="${contextPath}/plugin/jquery/jquery-1.11.3.min.js" type="text/javascript"></script>
    <link href="${contextPath}/css/app.css" rel="stylesheet" type="text/css"/>
    <script src="${contextPath}/js/locale.js" type="text/javascript"></script>
    <link href="${contextPath}/plugin/webix/codebase/webix.css" rel="stylesheet" type="text/css"/>
    <script src="${contextPath}/plugin/webix/codebase/webix.js" type="text/javascript"></script>
    <script src="${contextPath}/js/import.js" type="text/javascript"></script>
    <script src="${contextPath}/js/newutils.js?version=<%= new Date()%>" type="text/javascript"></script>
</head>
<body>
<div id="menu">
    <%@include file='/incloudes/menu.jsp' %>
</div>

<div>
    <div class="pagetitle">
        <ul class="breadcrumbs">
            <li><a href="${contextPath}/">Главная страница</a></li>
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
