/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package kz.diplom.gson;

import java.io.Serializable;

/**
 * Created by a.amanzhol on 20.11.2016.
 */
public class GsonGroupmembers implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String gName;
    private String gMember;
    private String gDescription;

    public GsonGroupmembers() {

    }


    public String getgName() {
        return gName;
    }

    public void setgName(String gName) {
        this.gName = gName;
        this.id = gName;
    }

    public String getgMember() {
        return gMember;
    }

    public void setgMember(String gMember) {
        this.gMember = gMember;
    }

    public String getgDescription() {
        return gDescription;
    }

    public void setgDescription(String gDescription) {
        this.gDescription = gDescription;
    }
}