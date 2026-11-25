package com.dashboard.dto.devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PairInitResponse {

    private String code;

    private long expiresInMinutes;
}
