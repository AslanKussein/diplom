package kz.diplom.rest;


import kz.diplom.session.UserSession;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import static kz.diplom.util.Util.objectToJson;

@Stateless
@Path("user")
public class UserResource {

    @EJB
    UserSession userSession;

    @Context
    SecurityContext sc;

    @Resource
    private javax.transaction.UserTransaction utx;

    private String getUserName() {
        return sc.getUserPrincipal().getName();
    }

    @GET
    @Produces("application/json")
    @Path("getUsersDetailList")
    public String getUsersDetailList(@QueryParam("start") Integer start, @QueryParam("limit") Integer limit) {
        return objectToJson(userSession.getUsersDetailList(start, limit));
    }

    @GET
    @Produces("application/json")
    @Path("getGroupMembersByUName")
    public String getGroupMembersByUName(@QueryParam("uName") String uName) {
        return objectToJson(userSession.getGroupMembersByUName(uName));
    }
}