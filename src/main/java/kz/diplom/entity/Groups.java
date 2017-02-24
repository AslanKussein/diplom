/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package kz.diplom.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

/**
 * Created by kusein-at on 17.11.2016.
 */
@Entity
@Table(name = "GROUPS")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "Groups.findAll", query = "SELECT g FROM Groups g"),
        @NamedQuery(name = "Groups.findByGName", query = "SELECT g FROM Groups g WHERE g.gName = :gName"),
        @NamedQuery(name = "Groups.findByGDescription", query = "SELECT g FROM Groups g WHERE g.gDescription = :gDescription")
})
public class Groups implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "G_NAME")
    private String gName;
    @Size(max = 1000)
    @Column(name = "G_DESCRIPTION")
    private String gDescription;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "groups")
    private List<Groupmembers> groupmembersList;

    public Groups() {
    }

    public Groups(String gName) {
        this.gName = gName;
    }

    public String getGName() {
        return gName;
    }

    public void setGName(String gName) {
        this.gName = gName;
    }

    public String getGDescription() {
        return gDescription;
    }

    public void setGDescription(String gDescription) {
        this.gDescription = gDescription;
    }

}