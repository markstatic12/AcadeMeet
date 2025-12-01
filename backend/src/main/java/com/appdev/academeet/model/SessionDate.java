package com.appdev.academeet.model;

import jakarta.persistence.Embeddable;

/**
 * Composite attribute representing a session date.
 * Embedded in Session entity.
 */
@Embeddable
public class SessionDate {

    private String month;
    private String day;
    private String year;

    public SessionDate() {
    }

    public SessionDate(String month, String day, String year) {
        this.month = month;
        this.day = day;
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    @Override
    public String toString() {
        return month + " " + day + ", " + year;
    }
}
