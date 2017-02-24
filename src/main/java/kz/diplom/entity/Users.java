package kz.diplom.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by kusein-at on 17.11.2016.
 */
@Entity
@Table(name = "USERS")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "Users.findAll", query = "SELECT u FROM Users u"),
        @NamedQuery(name = "Users.findByUName", query = "SELECT u FROM Users u WHERE u.uName = :uName"),
        @NamedQuery(name = "Users.findByUPassword", query = "SELECT u FROM Users u WHERE u.uPassword = :uPassword"),
        @NamedQuery(name = "Users.findByUDescription", query = "SELECT u FROM Users u WHERE u.uDescription = :uDescription"),
        @NamedQuery(name = "Users.findByUnameAndUpass", query = "SELECT u FROM Users u WHERE u.uName = :uName and u.uPassword = :uPassword")
})
public class Users {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull
    @Size(max = 200)
    @Column(name = "U_NAME")
    private String uName;
    @Size(max = 50)
    @Column(name = "U_PASSWORD")
    private String uPassword;
    @Size(max = 1000)
    @Column(name = "U_DESCRIPTION")
    private String uDescription;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "uName")
    private UserDetail userDetail;

    public Users(String uName) {
        this.uName = uName;
    }

    public Users() {
        this.uName = uName;
    }

    public String getuName() {
        return uName;
    }

    public void setuName(String uName) {
        this.uName = uName;
    }

    public String getuPassword() {
        return uPassword;
    }

    public void setuPassword(String uPassword) {
        this.uPassword = uPassword;
    }

    public String getuDescription() {
        return uDescription;
    }

    public void setuDescription(String uDescription) {
        this.uDescription = uDescription;
    }

    public UserDetail getUserDetail() {
        return userDetail;
    }

    public void setUserDetail(UserDetail userDetail) {
        this.userDetail = userDetail;
    }
}
