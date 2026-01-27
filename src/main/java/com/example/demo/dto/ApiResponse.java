package com.example.demo.dto;

import java.time.LocalDateTime;

public class ApiResponse {

    private String message;
    private boolean success;
    private Object data;
    private LocalDateTime timestamp;

    public ApiResponse(String message, boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(String message, Object data) {
        this(message, true, data);
    }

    // Legacy constructor support
    public ApiResponse(String message, LocalDateTime timestamp) {
        this.message = message;
        this.timestamp = timestamp;
        this.success = true;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

