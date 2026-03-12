package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import org.junit.jupiter.api.Test;

import com.example.backend.domain.EquipmentStatus;
import com.example.backend.exception.BadRequestException;

class EquipmentServiceRuleBTest {

	@Test
	void activeWithOldLastCleanedDate_isRejected() {
		Clock fixedClock = Clock.fixed(Instant.parse("2026-03-12T00:00:00Z"), ZoneId.of("UTC"));
		EquipmentService svc = new EquipmentService(null, null, null, fixedClock);

		LocalDate tooOld = LocalDate.of(2026, 1, 1);
		assertThrows(BadRequestException.class, () -> svc.enforceActiveStatusRule(EquipmentStatus.ACTIVE, tooOld));
	}
}

