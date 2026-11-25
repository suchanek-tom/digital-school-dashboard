package com.dashboard.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dashboard.dto.devices.PairConfirmRequest;
import com.dashboard.dto.devices.PairConfirmResponse;
import com.dashboard.dto.devices.PairInitResponse;
import com.dashboard.service.DevicePairingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/devices/pair")
@RequiredArgsConstructor
public class DevicePairingController {

    private static final Logger log = LoggerFactory.getLogger(DevicePairingController.class);

    private final DevicePairingService devicePairingService;

    @PostMapping("/init")
    public ResponseEntity<PairInitResponse> init() {
        log.debug("Device pairing init requested");
        return ResponseEntity.ok(devicePairingService.initPairing());
    }

    @PostMapping("/confirm")
    public ResponseEntity<PairConfirmResponse> confirm(@Valid @RequestBody PairConfirmRequest request) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(devicePairingService.confirmPairing(request));
    }
}
