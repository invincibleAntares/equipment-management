package com.example.backend.api.dto;

import java.time.LocalDate;

public record MaintenanceResponse(
		Long id,
		Long equipmentId,
		LocalDate maintenanceDate,
		String notes,
		String performedBy) {
}

