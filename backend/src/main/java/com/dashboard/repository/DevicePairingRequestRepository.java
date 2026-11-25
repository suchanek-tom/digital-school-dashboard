package com.dashboard.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dashboard.entity.DevicePairingRequest;
import com.dashboard.enums.PairingStatus;

@Repository
public interface DevicePairingRequestRepository extends JpaRepository<DevicePairingRequest, String> {

    boolean existsByCode(String code);

    // atomic transition, returns 1 only for the single caller that wins
    @Modifying(clearAutomatically = true)
    @Query("update DevicePairingRequest r set r.status = :to "
            + "where r.code = :code and r.status = :from and r.expiresAt > :now")
    int transitionStatus(@Param("code") String code, @Param("from") PairingStatus from,
            @Param("to") PairingStatus to, @Param("now") LocalDateTime now);
}
