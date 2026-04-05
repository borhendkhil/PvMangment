package com.example.demo.repository;

import com.example.demo.models.ComiteSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComiteSessionRepository extends JpaRepository<ComiteSession, Integer> {
    @Query("SELECT s FROM ComiteSession s WHERE s.comite.id = :comiteId")
    List<ComiteSession> findByComiteId(@Param("comiteId") Integer comiteId);
    
    @Query("SELECT s FROM ComiteSession s WHERE s.comite.id = :comiteId ORDER BY s.dateSession DESC")
    List<ComiteSession> findByComiteIdOrderByDateSessionDesc(@Param("comiteId") Integer comiteId);
}
