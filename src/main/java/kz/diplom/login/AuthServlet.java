package kz.diplom.login;

import kz.diplom.gson.GsonUsers;
import kz.diplom.session.UserSession;
import kz.diplom.util.Crypt;
import org.apache.log4j.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

import static kz.diplom.util.Util.getResultGsonString;
import static kz.diplom.util.Util.isNullOrEmpty;

@Stateless
@WebServlet(name = "AuthServlet", urlPatterns = {"/auth"})
public class AuthServlet extends HttpServlet {

    @EJB
    UserSession userSession;

    public static final String USER = "user";
    private static final Logger logger = Logger.getLogger(AuthServlet.class);

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            try {

                String j_username = request.getParameter("j_username");
                String j_password = request.getParameter("j_password");

                if (isNullOrEmpty(j_username) || isNullOrEmpty(j_password)) {
                    out.print(getResultGsonString(false, "Не все параметры заполнены"));
                }

                if (request.getUserPrincipal() != null) {
                    request.logout();
                }

                request.login(j_username, Crypt.MD5(j_password));

                GsonUsers user = userSession.getGsonUser(j_username);
                if (user != null) {
                    if (user.getUserDetail() != null && user.getUserDetail().getLocked() == 1) {
                        out.print(getResultGsonString(false, "Пользователь заблокирован, обратитесь Администратору"));
                        return;
                    }
                    HttpSession session = request.getSession(true);
                    session.setAttribute(USER, user);
                    out.print(getResultGsonString(true, null));
                }

            } catch (Exception e) {
                logger.error("error", e);
                out.print(getResultGsonString(false, "Ошибка авторизации"));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            HttpSession session = request.getSession(true);
            session.removeAttribute(USER);
            request.logout();
            request.getSession().invalidate();

        } catch (Exception e) {
            logger.error("error", e);
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}