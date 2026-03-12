package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.api.dto.EquipmentTypeResponse;
import com.example.backend.repository.EquipmentTypeRepository;

@Service
public class EquipmentTypeService {
	private final EquipmentTypeRepository equipmentTypeRepository;

	public EquipmentTypeService(EquipmentTypeRepository equipmentTypeRepository) {
		this.equipmentTypeRepository = equipmentTypeRepository;
	}

	@Transactional(readOnly = true)
	public List<EquipmentTypeResponse> listTypes() {
		return equipmentTypeRepository.findAll().stream()
				.map(t -> new EquipmentTypeResponse(t.getId(), t.getName()))
				.toList();
	}
}

