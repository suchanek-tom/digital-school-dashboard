package com.dashboard.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dashboard.dto.devices.PairConfirmRequest;
import com.dashboard.dto.devices.PairConfirmResponse;
import com.dashboard.dto.devices.PairInitResponse;
import com.dashboard.entity.DevicePairingRequest;
import com.dashboard.entity.PairedDevice;
import com.dashboard.enums.PairingStatus;
import com.dashboard.exception.InvalidRequestException;
import com.dashboard.repository.DevicePairingRequestRepository;
import com.dashboard.repository.PairedDeviceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DevicePairingService {

    private static final String CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;

    private final DevicePairingRequestRepository pairingRequestRepository;
    private final PairedDeviceRepository pairedDeviceRepository;
    private final SecureRandom random = new SecureRandom();

    // configured in seconds
    @Value("${app.paring-code-expiration}")
    private long codeExpirationSeconds;

    public PairInitResponse initPairing() {
        String code;
        do {
            code = generateCode();
        } while (pairingRequestRepository.existsByCode(code));

        DevicePairingRequest request = DevicePairingRequest.builder()
                .status(PairingStatus.PENDING)
                .code(code)
                .expiresAt(LocalDateTime.now().plusSeconds(codeExpirationSeconds))
                .build();
        pairingRequestRepository.save(request);

        return new PairInitResponse(code, codeExpirationSeconds / 60);
    }

    @Transactional
    public PairConfirmResponse confirmPairing(PairConfirmRequest request) {
        String code = request.getCode().toUpperCase();
        int updated = pairingRequestRepository.transitionStatus(code, PairingStatus.PENDING,
                PairingStatus.DELIVERING, LocalDateTime.now());
        if (updated == 0) {
            throw new InvalidRequestException("Invalid, expired or already used pairing code");
        }

        PairedDevice device = pairedDeviceRepository.save(new PairedDevice());
        return new PairConfirmResponse(device.getUid());
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CODE_ALPHABET.charAt(random.nextInt(CODE_ALPHABET.length())));
        }
        return sb.toString();
    }
}
