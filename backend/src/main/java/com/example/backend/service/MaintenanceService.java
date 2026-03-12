package com.example.backend.service;

import java.time.Clock;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.api.dto.MaintenanceCreateRequest;
import com.example.backend.api.dto.MaintenanceResponse;
import com.example.backend.domain.Equipment;
import com.example.backend.domain.EquipmentStatus;
import com.example.backend.domain.MaintenanceLog;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.MaintenanceLogRepository;

@Service
public class MaintenanceService {
	private final EquipmentRepository equipmentRepository;
	private final MaintenanceLogRepository maintenanceLogRepository;
	@SuppressWarnings("unused")
	private final Clock clock;

	public MaintenanceService(
			EquipmentRepository equipmentRepository,
			MaintenanceLogRepository maintenanceLogRepository,
			Clock clock) {
		this.equipmentRepository = equipmentRepository;
		this.maintenanceLogRepository = maintenanceLogRepository;
		this.clock = clock;
	}

	@Transactional
	public MaintenanceResponse createMaintenance(MaintenanceCreateRequest request) {
		Equipment equipment = equipmentRepository.findById(request.equipmentId())
				.orElseThrow(() -> new NotFoundException("Equipment not found.", "EQUIPMENT_NOT_FOUND"));

		MaintenanceLog log = new MaintenanceLog(
				equipment,
				request.maintenanceDate(),
				normalizeOptionalText(request.notes()),
				request.performedBy().trim());
		log = maintenanceLogRepository.save(log);

		// Rule A: maintenance creation updates equipment
		equipment.setStatus(EquipmentStatus.ACTIVE);
		equipment.setLastCleanedDate(request.maintenanceDate());
		equipmentRepository.save(equipment);

		return toResponse(log);
	}

	@Transactional(readOnly = true)
	public List<MaintenanceResponse> getMaintenanceForEquipment(long equipmentId) {
		if (!equipmentRepository.existsById(equipmentId)) {
			throw new NotFoundException("Equipment not found.", "EQUIPMENT_NOT_FOUND");
		}
		return maintenanceLogRepository.findByEquipment_IdOrderByMaintenanceDateDescIdDesc(equipmentId).stream()
				.map(this::toResponse)
				.toList();
	}

	private MaintenanceResponse toResponse(MaintenanceLog log) {
		return new MaintenanceResponse(
				log.getId(),
				log.getEquipment().getId(),
				log.getMaintenanceDate(),
				log.getNotes(),
				log.getPerformedBy());
	}

	private static String normalizeOptionalText(String s) {
		if (s == null) {
			return null;
		}
		String trimmed = s.trim();
		return trimmed.isEmpty() ? null : trimmed;
	}
}

