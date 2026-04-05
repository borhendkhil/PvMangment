package com.example.demo.repository;

import com.example.demo.models.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DecisionRepository extends JpaRepository<Decision, Integer> {
    @Query("SELECT d FROM Decision d WHERE d.sujetId = :sujetId AND d.current = true")
    List<Decision> findBySujetIdAndCurrentTrue(@Param("sujetId") Integer sujetId);
    
    @Query("SELECT d FROM Decision d WHERE d.sujetId = :sujetId ORDER BY d.dateCreation DESC")
    List<Decision> findBySujetId(@Param("sujetId") Integer sujetId);
}
