package com.example.demo.repository;

import com.example.demo.entity.SujetDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SujetDecisionRepository extends JpaRepository<SujetDecision, Integer> {
}
