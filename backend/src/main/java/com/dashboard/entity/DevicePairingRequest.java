package com.dashboard.entity;

import java.time.LocalDateTime;

import com.dashboard.enums.PairingStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "device_pairing_request")
public class DevicePairingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "uid")
    private String uid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PairingStatus status;

    @Column(nullable = false, unique = true, length = 6)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}
