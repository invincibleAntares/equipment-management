package com.example.backend.exception;

import java.util.Map;

public class BadRequestException extends RuntimeException {
	private final String code;
	private final Map<String, String> fieldErrors;

	public BadRequestException(String message, String code) {
		this(message, code, null);
	}

	public BadRequestException(String message, String code, Map<String, String> fieldErrors) {
		super(message);
		this.code = code;
		this.fieldErrors = fieldErrors;
	}

	public String getCode() {
		return code;
	}

	public Map<String, String> getFieldErrors() {
		return fieldErrors;
	}
}

