package kz.diplom.wrapper;

import com.google.gson.Gson;
import kz.diplom.gson.*;

public class Serialization {

    public static GsonUserDetail wrapToGsonUserDetailByJsonString(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, GsonUserDetail.class);
    }
}