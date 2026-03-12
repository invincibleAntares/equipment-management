package com.example.backend.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.api.dto.EquipmentResponse;
import com.example.backend.api.dto.EquipmentUpsertRequest;
import com.example.backend.api.dto.MaintenanceResponse;
import com.example.backend.service.EquipmentService;
import com.example.backend.service.MaintenanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {
	private final EquipmentService equipmentService;
	private final MaintenanceService maintenanceService;

	public EquipmentController(EquipmentService equipmentService, MaintenanceService maintenanceService) {
		this.equipmentService = equipmentService;
		this.maintenanceService = maintenanceService;
	}

	@GetMapping
	public List<EquipmentResponse> listEquipment() {
		return equipmentService.listEquipment();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public EquipmentResponse createEquipment(@Valid @RequestBody EquipmentUpsertRequest request) {
		return equipmentService.createEquipment(request);
	}

	@PutMapping("/{id}")
	public EquipmentResponse updateEquipment(@PathVariable long id, @Valid @RequestBody EquipmentUpsertRequest request) {
		return equipmentService.updateEquipment(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteEquipment(@PathVariable long id, @RequestParam(defaultValue = "false") boolean force) {
		equipmentService.deleteEquipment(id, force);
	}

	@GetMapping("/{id}/maintenance")
	public List<MaintenanceResponse> getMaintenance(@PathVariable long id) {
		return maintenanceService.getMaintenanceForEquipment(id);
	}
}

