package com.example.demo.repository;

import com.example.demo.models.RoleComite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleComiteRepository extends JpaRepository<RoleComite, Integer> {
    RoleComite findByName(String name);
}
