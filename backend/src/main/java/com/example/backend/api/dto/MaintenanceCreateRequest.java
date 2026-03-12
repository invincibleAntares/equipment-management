package com.example.backend.api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MaintenanceCreateRequest(
		@NotNull Long equipmentId,
		@NotNull LocalDate maintenanceDate,
		@Size(max = 1000) String notes,
		@NotBlank @Size(max = 120) String performedBy) {
}

