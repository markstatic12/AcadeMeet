package com.appdev.academeet.util;

import java.time.LocalDateTime;
import java.time.Month;

public class DateTimeUtils {
    public static LocalDateTime parseFromSeparateFields(String month, String day, String year, String timeStr) {
        if (month == null || day == null || year == null || timeStr == null) {
            throw new IllegalArgumentException("Date and time fields cannot be null");
        }

        try {
            Month monthEnum = parseMonth(month);
            int dayInt = Integer.parseInt(day);
            int yearInt = Integer.parseInt(year);
            
            String[] timeParts = timeStr.split(":");
            if (timeParts.length != 2) {
                throw new IllegalArgumentException("Time must be in HH:mm format");
            }
            int hour = Integer.parseInt(timeParts[0]);
            int minute = Integer.parseInt(timeParts[1]);
            
            return LocalDateTime.of(yearInt, monthEnum, dayInt, hour, minute);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid numeric value in date/time fields: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date/time format: " + e.getMessage(), e);
        }
    }

    public static LocalDateTime parseNullableFromSeparateFields(String month, String day, String year, String timeStr) {
        if (month == null || day == null || year == null || timeStr == null) {
            return null;
        }

        return parseFromSeparateFields(month, day, year, timeStr);
    }

    private static Month parseMonth(String monthStr) {
        if (monthStr == null) {
            throw new IllegalArgumentException("Month cannot be null");
        }
        
        try {
            int monthNum = Integer.parseInt(monthStr);
            return Month.of(monthNum);
        } catch (NumberFormatException e) {
            return Month.valueOf(monthStr.toUpperCase());
        }
    }
}
