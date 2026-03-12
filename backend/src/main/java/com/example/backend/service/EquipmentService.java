package com.example.backend.service;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.api.dto.EquipmentResponse;
import com.example.backend.api.dto.EquipmentTypeResponse;
import com.example.backend.api.dto.EquipmentUpsertRequest;
import com.example.backend.domain.Equipment;
import com.example.backend.domain.EquipmentStatus;
import com.example.backend.domain.EquipmentType;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.EquipmentTypeRepository;
import com.example.backend.repository.MaintenanceLogRepository;

@Service
public class EquipmentService {
	private static final int ACTIVE_MAX_DIRTY_DAYS = 30;

	private final EquipmentRepository equipmentRepository;
	private final EquipmentTypeRepository equipmentTypeRepository;
	private final MaintenanceLogRepository maintenanceLogRepository;
	private final Clock clock;

	public EquipmentService(
			EquipmentRepository equipmentRepository,
			EquipmentTypeRepository equipmentTypeRepository,
			MaintenanceLogRepository maintenanceLogRepository,
			Clock clock) {
		this.equipmentRepository = equipmentRepository;
		this.equipmentTypeRepository = equipmentTypeRepository;
		this.maintenanceLogRepository = maintenanceLogRepository;
		this.clock = clock;
	}

	@Transactional(readOnly = true)
	public List<EquipmentResponse> listEquipment() {
		return equipmentRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Transactional
	public EquipmentResponse createEquipment(EquipmentUpsertRequest request) {
		EquipmentType type = equipmentTypeRepository.findById(request.typeId())
				.orElseThrow(() -> new NotFoundException("Equipment type not found.", "EQUIPMENT_TYPE_NOT_FOUND"));

		enforceActiveStatusRule(request.status(), request.lastCleanedDate());

		Equipment created = new Equipment(request.name().trim(), type, request.status(), request.lastCleanedDate());
		created = equipmentRepository.save(created);
		return toResponse(created);
	}

	@Transactional
	public EquipmentResponse updateEquipment(long id, EquipmentUpsertRequest request) {
		Equipment equipment = equipmentRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Equipment not found.", "EQUIPMENT_NOT_FOUND"));

		EquipmentType type = equipmentTypeRepository.findById(request.typeId())
				.orElseThrow(() -> new NotFoundException("Equipment type not found.", "EQUIPMENT_TYPE_NOT_FOUND"));

		enforceActiveStatusRule(request.status(), request.lastCleanedDate());

		equipment.setName(request.name().trim());
		equipment.setType(type);
		equipment.setStatus(request.status());
		equipment.setLastCleanedDate(request.lastCleanedDate());

		return toResponse(equipmentRepository.save(equipment));
	}

	@Transactional
	public void deleteEquipment(long id, boolean force) {
		Equipment equipment = equipmentRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Equipment not found.", "EQUIPMENT_NOT_FOUND"));

		boolean hasMaintenance = maintenanceLogRepository.existsByEquipment_Id(equipment.getId());
		if (hasMaintenance && !force) {
			throw new ConflictException(
					"Equipment cannot be deleted because maintenance history exists.",
					"EQUIPMENT_DELETE_BLOCKED_BY_MAINTENANCE_HISTORY");
		}

		if (hasMaintenance && force) {
			maintenanceLogRepository.deleteByEquipment_Id(equipment.getId());
		}
		equipmentRepository.delete(equipment);
	}

	void enforceActiveStatusRule(EquipmentStatus status, LocalDate lastCleanedDate) {
		if (status != EquipmentStatus.ACTIVE) {
			return;
		}

		LocalDate today = LocalDate.now(clock);
		LocalDate cutoff = today.minusDays(ACTIVE_MAX_DIRTY_DAYS);
		if (lastCleanedDate.isBefore(cutoff)) {
			throw new BadRequestException(
					"Equipment cannot be marked Active because last cleaned date is older than 30 days.",
					"EQUIPMENT_ACTIVE_REQUIRES_RECENT_CLEANING");
		}
	}

	private EquipmentResponse toResponse(Equipment e) {
		return new EquipmentResponse(
				e.getId(),
				e.getName(),
				new EquipmentTypeResponse(e.getType().getId(), e.getType().getName()),
				e.getStatus(),
				e.getLastCleanedDate());
	}
}

