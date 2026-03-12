package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.MaintenanceLog;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {
	boolean existsByEquipment_Id(Long equipmentId);

	List<MaintenanceLog> findByEquipment_IdOrderByMaintenanceDateDescIdDesc(Long equipmentId);
}

