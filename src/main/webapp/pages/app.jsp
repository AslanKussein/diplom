<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" type="image/ico" sizes="16x16" href="../images/favicon.ico">
        <title>Заявления</title>
        <script src="${contextPath}/plugin/jquery/jquery-1.11.3.min.js" type="text/javascript"></script>
        <link href="${contextPath}/plugin/font-awesome-4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
        <script src="${contextPath}/plugin/webix/codebase/webix.js" type="text/javascript"></script>
        <link href="${contextPath}/plugin/webix/codebase/webix.css" rel="stylesheet" type="text/css"/>
        <script src="${contextPath}/plugin/webix/codebase/sidebar.js" type="text/javascript"></script>
        <link href="${contextPath}/plugin/webix/codebase/sidebar.css" rel="stylesheet" type="text/css"/>
        <script src="${contextPath}/js/createapp.js" type="text/javascript"></script>
        <script src="${contextPath}/js${contextPath}.js" type="text/javascript"></script>
        <link href="${contextPath}/css${contextPath}.css" rel="stylesheet" type="text/css"/>
        <script src="${contextPath}/js${contextPath}fields.js" type="text/javascript"></script>
    </head>
    <body>
        <div id="menu">
            <%@include file='/incloudes/menu.jsp' %>
        </div>

        <div class="middlecontent">
            <div id="mainlayot"></div>

            <div id="appsTablePaging"></div>
        </div>
    </body>
</html>
