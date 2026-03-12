package com.example.backend.api.dto;

import java.time.LocalDate;

import com.example.backend.domain.EquipmentStatus;

public record EquipmentResponse(
		Long id,
		String name,
		EquipmentTypeResponse type,
		EquipmentStatus status,
		LocalDate lastCleanedDate) {
}

