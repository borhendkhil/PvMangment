package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "direction")
@Data
@ToString(exclude = "employes")
@EqualsAndHashCode(exclude = "employes")
public class Direction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 10)
    private String code;

    @Column(nullable = false, length = 255)
    private String lib;

    private String address;

    @OneToMany(mappedBy = "direction", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Employe> employes;

    public Direction() {}

    public Direction(String code, String lib, String address) {
        this.code = code;
        this.lib = lib;
        this.address = address;
    }
}
