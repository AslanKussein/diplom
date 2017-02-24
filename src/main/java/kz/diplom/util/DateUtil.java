package kz.diplom.util;

import javax.xml.datatype.XMLGregorianCalendar;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DateUtil {

    public static String dateToString(Date date, String f) {                        
        if (date != null) {
            return new SimpleDateFormat(f, Locale.ENGLISH).format(date);
        }
        return null;
    }

    public static String dateToString(Date date) {
        return dateToString(date, "dd.MM.yyyy");
    }

    public static String dateTimeToString(Date date, String f) {
        if (date != null) {
            return new SimpleDateFormat(f, Locale.ENGLISH).format(date);
        }
        return null;
    }

    public static Date stringToDate(String date) {
        if (date != null && !date.isEmpty()) {
            try {
                date = date.substring(0, 10);

                if (date.contains(".")) {
                    return new SimpleDateFormat("dd.MM.yyyy", Locale.ENGLISH).parse(date);
                } else if (date.contains("-")) {
                    return new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH).parse(date);
                }
                return new SimpleDateFormat("ddMMyyyy", Locale.ENGLISH).parse(date);
            } catch (ParseException ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    public static java.sql.Date stringToSqlDate(String date){
        if (date != null && !date.isEmpty()) {
            return  new java.sql.Date(stringToDate(date).getTime());
        }
        return null;
    }

    public static Date stringToDates(String date) {
        if (date != null && !date.isEmpty()) {
            try {
                date = date.substring(0, 10);
                if (date.contains("-")) {
                    date = date.replace("-",".");
                    return new SimpleDateFormat("yyyy.MM.dd", Locale.ENGLISH).parse(date);
                }
            } catch (ParseException ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    public static Date calculateDateObr(final Date date, Character sexId) {
        if(date != null){
            Calendar dob = Calendar.getInstance();
            int id = 0;
            dob.setTime(date);
            if(sexId.equals('0')){
                id = 58;
            } else
            if(sexId.equals('1')){
                id = 63;
            }

            dob.add(Calendar.YEAR, id);
            return dob.getTime();
        }
        return null;
    }

    public static int differenceTwoYear(Date d1, Date d2) {
        if(d1 != null && d2 != null){
            Calendar cal = Calendar.getInstance();
            cal.setTime(d1);
            int year = cal.get(Calendar.YEAR);
            cal.setTime(d2);
            int year2 = cal.get(Calendar.YEAR);
            return (year2-year);
        }
        return 0;
    }
    
    public static Date getDateByYMD(int year, int month, int day) {
        Calendar c = Calendar.getInstance();
        c.set(year, month, day, 0, 0);
        c.add(Calendar.MONTH, -1);
        return c.getTime();
    }

    public static Date getDateByXmlDate(XMLGregorianCalendar dte) {
        if (dte != null) {
            Date date = getDateByYMD(dte.getYear(), dte.getMonth(), dte.getDay());
            return date;
        }
        return null;
    }

    public static int dateToInt(Date d) {
        Calendar cal = Calendar.getInstance();
        if (d != null){
            cal.setTime(d);
            return cal.get(Calendar.YEAR);
        }
        else return 0;
    }
}