/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package kz.diplom.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Embeddable
public class GroupmembersPK implements Serializable {
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "G_NAME")
    private String gName;
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "G_MEMBER")
    private String gMember;

    public GroupmembersPK() {
    }

    public GroupmembersPK(String gName, String gMember) {
        this.gName = gName;
        this.gMember = gMember;
    }

    public String getGName() {
        return gName;
    }

    public void setGName(String gName) {
        this.gName = gName;
    }

    public String getGMember() {
        return gMember;
    }

    public void setGMember(String gMember) {
        this.gMember = gMember;
    }
}