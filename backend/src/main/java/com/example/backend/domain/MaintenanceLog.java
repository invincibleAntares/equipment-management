package com.example.backend.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "maintenance_logs")
public class MaintenanceLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "equipment_id", nullable = false)
	private Equipment equipment;

	@Column(name = "maintenance_date", nullable = false)
	private LocalDate maintenanceDate;

	@Lob
	@Column
	private String notes;

	@Column(name = "performed_by", nullable = false, length = 120)
	private String performedBy;

	protected MaintenanceLog() {
	}

	public MaintenanceLog(Equipment equipment, LocalDate maintenanceDate, String notes, String performedBy) {
		this.equipment = equipment;
		this.maintenanceDate = maintenanceDate;
		this.notes = notes;
		this.performedBy = performedBy;
	}

	public Long getId() {
		return id;
	}

	public Equipment getEquipment() {
		return equipment;
	}

	public LocalDate getMaintenanceDate() {
		return maintenanceDate;
	}

	public String getNotes() {
		return notes;
	}

	public String getPerformedBy() {
		return performedBy;
	}
}

