package com.example.backend.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.api.dto.MaintenanceCreateRequest;
import com.example.backend.api.dto.MaintenanceResponse;
import com.example.backend.service.MaintenanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {
	private final MaintenanceService maintenanceService;

	public MaintenanceController(MaintenanceService maintenanceService) {
		this.maintenanceService = maintenanceService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public MaintenanceResponse create(@Valid @RequestBody MaintenanceCreateRequest request) {
		return maintenanceService.createMaintenance(request);
	}
}

