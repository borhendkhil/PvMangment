package com.example.demo.dto;

public class AuthResponse {
    private String token;
    private String roleName;
    private Integer roleId;
    private String nomPrenom;

    public AuthResponse() {}

    public AuthResponse(String token, Integer roleId, String roleName) {
        this.token = token;
        this.roleId = roleId;
        this.roleName = roleName;
        this.nomPrenom = "المسؤول";
    }

    public AuthResponse(String token, Integer roleId, String roleName, String nomPrenom) {
        this.token = token;
        this.roleId = roleId;
        this.roleName = roleName;
        this.nomPrenom = nomPrenom;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getNomPrenom() {
        return nomPrenom;
    }

    public void setNomPrenom(String nomPrenom) {
        this.nomPrenom = nomPrenom;
    }
}
