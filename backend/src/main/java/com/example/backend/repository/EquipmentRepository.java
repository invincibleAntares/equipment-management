package com.example.backend.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
	@Override
	@EntityGraph(attributePaths = { "type" })
	java.util.List<Equipment> findAll();
}

