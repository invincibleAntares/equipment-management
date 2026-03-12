package com.example.backend.exception;

import java.util.Map;

public record ApiErrorResponse(
		String message,
		String code,
		Map<String, String> fieldErrors) {
}

