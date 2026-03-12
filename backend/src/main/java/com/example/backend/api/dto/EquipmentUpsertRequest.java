package com.example.backend.api.dto;

import java.time.LocalDate;

import com.example.backend.domain.EquipmentStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EquipmentUpsertRequest(
		@NotBlank @Size(max = 120) String name,
		@NotNull Long typeId,
		@NotNull EquipmentStatus status,
		@NotNull LocalDate lastCleanedDate) {
}

