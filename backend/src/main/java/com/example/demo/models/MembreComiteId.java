package com.example.demo.models;

import java.io.Serializable;
import java.util.Objects;
import lombok.Data;

@Data
public class MembreComiteId implements Serializable {
    private Integer comiteId;
    private Integer employeId;

    public MembreComiteId() {}

    public MembreComiteId(Integer comiteId, Integer employeId) {
        this.comiteId = comiteId;
        this.employeId = employeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MembreComiteId that = (MembreComiteId) o;
        return Objects.equals(comiteId, that.comiteId) &&
               Objects.equals(employeId, that.employeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(comiteId, employeId);
    }
}
