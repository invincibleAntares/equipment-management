package com.example.backend.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "equipment")
public class Equipment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 120)
	private String name;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "type_id", nullable = false)
	private EquipmentType type;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 32)
	private EquipmentStatus status;

	@Column(name = "last_cleaned_date", nullable = false)
	private LocalDate lastCleanedDate;

	protected Equipment() {
	}

	public Equipment(String name, EquipmentType type, EquipmentStatus status, LocalDate lastCleanedDate) {
		this.name = name;
		this.type = type;
		this.status = status;
		this.lastCleanedDate = lastCleanedDate;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public EquipmentType getType() {
		return type;
	}

	public void setType(EquipmentType type) {
		this.type = type;
	}

	public EquipmentStatus getStatus() {
		return status;
	}

	public void setStatus(EquipmentStatus status) {
		this.status = status;
	}

	public LocalDate getLastCleanedDate() {
		return lastCleanedDate;
	}

	public void setLastCleanedDate(LocalDate lastCleanedDate) {
		this.lastCleanedDate = lastCleanedDate;
	}
}

