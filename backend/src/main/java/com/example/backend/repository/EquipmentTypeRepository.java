package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.EquipmentType;

public interface EquipmentTypeRepository extends JpaRepository<EquipmentType, Long> {
	boolean existsByNameIgnoreCase(String name);
}

