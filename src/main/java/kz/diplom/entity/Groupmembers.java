/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package kz.diplom.entity;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Created by kusein-at on 17.11.2016.
 */
@Entity
@Table(name = "GROUPMEMBERS")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "Groupmembers.findAll", query = "SELECT g FROM Groupmembers g"),
        @NamedQuery(name = "Groupmembers.findByGName", query = "SELECT g FROM Groupmembers g WHERE g.groupmembersPK.gName = :gName"),
        @NamedQuery(name = "Groupmembers.findByGMember", query = "SELECT g FROM Groupmembers g WHERE g.groupmembersPK.gMember = :gMember"),
        @NamedQuery(name = "Groupmembers.findById", query = "SELECT g FROM Groupmembers g WHERE g.id = :id")
})
public class Groupmembers implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    protected GroupmembersPK groupmembersPK;
    @Column(name = "ID")
    private Long id;
    @JoinColumn(name = "G_NAME", referencedColumnName = "G_NAME", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Groups groups;

    public Groupmembers() {
    }

    public Groupmembers(GroupmembersPK groupmembersPK) {
        this.groupmembersPK = groupmembersPK;
    }

    public Groupmembers(String gName, String gMember) {
        this.groupmembersPK = new GroupmembersPK(gName, gMember);
    }

    public GroupmembersPK getGroupmembersPK() {
        return groupmembersPK;
    }

    public void setGroupmembersPK(GroupmembersPK groupmembersPK) {
        this.groupmembersPK = groupmembersPK;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Groups getGroups() {
        return groups;
    }

    public void setGroups(Groups groups) {
        this.groups = groups;
    }
}