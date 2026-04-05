package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "membre_comite")
@IdClass(MembreComiteId.class)
@Data
public class MembreComite {
    @Id
    @Column(name = "comite_id")
    private Integer comiteId;

    @Id
    @Column(name = "employe_id")
    private Integer employeId;

    @ManyToOne
    @JoinColumn(name = "comite_id", insertable = false, updatable = false)
    @JsonBackReference
    private Comite comite;

    @ManyToOne
    @JoinColumn(name = "employe_id", insertable = false, updatable = false)
    @JsonBackReference
    private Employe employe;

    @ManyToOne
    @JoinColumn(name = "role_comite_id")
    private RoleComite roleComite;

    public MembreComite() {}

    public MembreComite(Integer comiteId, Integer employeId, RoleComite roleComite) {
        this.comiteId = comiteId;
        this.employeId = employeId;
        this.roleComite = roleComite;
    }
}
