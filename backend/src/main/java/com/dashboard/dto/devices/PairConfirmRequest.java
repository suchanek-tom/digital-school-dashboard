package com.dashboard.dto.devices;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PairConfirmRequest {

    @NotBlank
    @Size(min = 6, max = 6)
    private String code;
}
