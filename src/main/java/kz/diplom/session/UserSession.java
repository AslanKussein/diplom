package kz.diplom.session;

import kz.diplom.entity.Groupmembers;
import kz.diplom.entity.UserDetail;
import kz.diplom.entity.Users;
import kz.diplom.gson.GsonDatatableData;
import kz.diplom.gson.GsonGroupmembers;
import kz.diplom.gson.GsonUsers;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

import static kz.diplom.util.Util.getSingleResultOrNull;
import static kz.diplom.wrapper.Wrapper.*;

/**
 * Created by kusein-at on 17.11.2016.
 */
@Stateless
public class UserSession {

    @PersistenceContext(unitName = "diplom")
    private EntityManager em;

    public GsonUsers getGsonUser(String uName) {
        try {
            Users user = getUser(uName);
            return wrapToGsonUsers(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Users getUser(String uName) {
        try {
            return (Users) getSingleResultOrNull(em.createNamedQuery("Users.findByUName").setParameter("uName", uName));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public GsonDatatableData getUsersDetailList(Integer start, Integer limit) {
        if (start == null) {
            start = 0;
        }
        if (limit == null) {
            limit = 15;
        }
        GsonDatatableData data = new GsonDatatableData();
        try {
            List<UserDetail> list = em.createNamedQuery("UserDetail.findAll")
                    .setFirstResult(start)
                    .setMaxResults(limit)
                    .getResultList();
            data.setData(wrapToGsonUserDetailList(list));
            data.setPos(start);
            Query q = em.createQuery(" SELECT count(u)  FROM UserDetail u ");
            Long recordSize = (Long) q.getSingleResult();
            data.setTotal_count(recordSize.intValue());

        } catch (NoResultException e) {
        }
        return data;
    }

    public List<GsonGroupmembers> getGroupMembersByUName(String uName) {
        List<GsonGroupmembers> result;
        try {
            List<Groupmembers> list = em.createNamedQuery("Groupmembers.findByGMember")
                    .setParameter("gMember", uName)
                    .getResultList();
            result = wrapToGsonGroupmembersList(list);
        } catch (NoResultException e) {
            result = new ArrayList<>();
        }

        return result;
    }
}