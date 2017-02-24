/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package kz.diplom.entity;

import javax.persistence.*;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Created by kusein-at on 17.11.2016.
 */
@Entity
@Table(name = "USER_DETAIL")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "UserDetail.findAll", query = "SELECT u FROM UserDetail u"),
        @NamedQuery(name = "UserDetail.findByFirstname", query = "SELECT u FROM UserDetail u WHERE u.firstname = :firstname"),
        @NamedQuery(name = "UserDetail.findByLastname", query = "SELECT u FROM UserDetail u WHERE u.lastname = :lastname"),
        @NamedQuery(name = "UserDetail.findByMiddlename", query = "SELECT u FROM UserDetail u WHERE u.middlename = :middlename"),
        @NamedQuery(name = "UserDetail.findByUName", query = "SELECT u FROM UserDetail u WHERE u.uName = :uName")
})
public class UserDetail implements Serializable {

    private static final long serialVersionUID = 1L;

    @Size(max = 200)
    @Column(name = "FIRSTNAME")
    private String firstname;
    @Size(max = 200)
    @Column(name = "LASTNAME")
    private String lastname;
    @Size(max = 200)
    @Column(name = "MIDDLENAME")
    private String middlename;
    @Size(max = 200)
    @Column(name = "EMAIL")
    private String email;
    @Column(name = "LOCKED")
    private Integer locked;
    @Id
    @JoinColumn(name = "U_NAME", referencedColumnName = "U_NAME")
    @OneToOne
    private Users uName;

    public UserDetail() {
    }

    public Integer getLocked() {
        return locked;
    }

    public void setLocked(Integer locked) {
        this.locked = locked;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getMiddlename() {
        return middlename;
    }

    public void setMiddlename(String middlename) {
        this.middlename = middlename;
    }

    public Users getuName() {
        return uName;
    }

    public void setuName(Users uName) {
        this.uName = uName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}