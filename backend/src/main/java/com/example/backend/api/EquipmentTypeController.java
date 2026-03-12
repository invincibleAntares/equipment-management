package com.example.backend.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.api.dto.EquipmentTypeResponse;
import com.example.backend.service.EquipmentTypeService;

@RestController
@RequestMapping("/api/equipment-types")
public class EquipmentTypeController {
	private final EquipmentTypeService equipmentTypeService;

	public EquipmentTypeController(EquipmentTypeService equipmentTypeService) {
		this.equipmentTypeService = equipmentTypeService;
	}

	@GetMapping
	public List<EquipmentTypeResponse> list() {
		return equipmentTypeService.listTypes();
	}
}

