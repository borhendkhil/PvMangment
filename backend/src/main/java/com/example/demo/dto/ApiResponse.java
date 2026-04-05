package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Réponse API standard pour tous les endpoints
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;
    private String error;

    /**
     * Constructeur pour réponse avec données
     */
    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Constructeur pour réponse simple (sans données)
     */
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }

    /**
     * Constructeur pour réponse d'erreur
     */
    public static ApiResponse error(String message, String error) {
        return new ApiResponse(false, message, null) {{
            setError(error);
        }};
    }

    /**
     * Factory pour réponse success
     */
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data);
    }

    /**
     * Factory pour réponse success sans données
     */
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message, null);
    }
}
