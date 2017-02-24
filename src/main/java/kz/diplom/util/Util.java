package kz.diplom.util;

import com.google.gson.Gson;
import kz.diplom.gson.GsonResult;

import javax.persistence.NonUniqueResultException;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Util {

    public static Object getSingleResultOrNull(Query query) {
        List results = query.getResultList();
        if (results.isEmpty()) {
            return null;
        } else if (results.size() == 1) {
            return results.get(0);
        }
        throw new NonUniqueResultException();
    }

    public static String objectToJson(Object obj) {
        return (new Gson().toJson(obj));
    }

    public static GsonResult getResultGson(Boolean result, Object message) {
        GsonResult gson = new GsonResult();
        gson.setResult(result);
        gson.setMessage(message);
        return gson;
    }

    public static String getResultGsonString(Boolean result, Object message) {
        return objectToJson(getResultGson(result, message));
    }

    public static Boolean isNullOrEmpty(String value) {
        return (value == null || value.trim().isEmpty());
    }


    public static GsonResult getGsonResult(Boolean result, Object message) {
        GsonResult gson = new GsonResult();
        gson.setResult(result);
        gson.setMessage(message);
        return gson;
    }

    public static String objectToString(Object obj) {
        if (obj != null && !obj.toString().trim().isEmpty()) {
            return obj.toString();
        }

        return "";
    }

    public static String getValueOrEmpty(String val) {
        if(val == null)
            return  "";
        else
            return  val;
    }

    public static Long objectToLong(Object obj) {
        if (obj != null && !obj.toString().trim().isEmpty()) {
            BigDecimal b = new BigDecimal(obj.toString());
            return b.longValue();
        }

        return 0L;
    }

    public static boolean isInteger(String s) {
        return isInteger(s, 10);
    }

    public static boolean isInteger(String s, int radix) {
        if (s.isEmpty()) {
            return false;
        }
        for (int i = 0; i < s.length(); i++) {
            if (i == 0 && s.charAt(i) == '-') {
                if (s.length() == 1) {
                    return false;
                } else {
                    continue;
                }
            }
            if (Character.digit(s.charAt(i), radix) < 0) {
                return false;
            }
        }
        return true;
    }

    public static int randInt(int min, int max) {
        int randomNum = ThreadLocalRandom.current().nextInt(min, max + 1);
        return randomNum;
    }

    public static String createGuid() {
        return java.util.UUID.randomUUID().toString();
    }

    public static String getFileExtension(String filename) {
        int i = filename.lastIndexOf('.');
        if (i > 0) {
            return filename.substring(i + 1);
        }
        return filename;
    }

    public static String readableFileSize(Long size) {
        if (size == null || size <= 0) {
            return "0";
        }
        final String[] units = new String[]{"байт", "КБ", "МБ", "ГБ", "ТБ"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return new DecimalFormat("#,##0.#").format(size / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }
}
