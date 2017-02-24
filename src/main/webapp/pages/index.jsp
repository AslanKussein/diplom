
<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%
    if (request.isUserInRole("admin_role")){
        %>
             <%@include file='admin/import.jsp' %>
        <%
    } else {
        %>
            <%@include file='../login.jsp' %>
        <%
    }

%>