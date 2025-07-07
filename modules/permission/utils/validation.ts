/**
 * Permission Validation Utils
 * Utilities for validating permission data
 */
import { PERMISSION_CONSTANTS } from '../constants'
import type { CreatePermissionData, UpdatePermissionData } from '../types'

export interface ValidationResult {
	isValid: boolean
	errors: string[]
}

export class PermissionValidator {
	/**
	 * Validate permission name
	 */
	static validateName(name: string): ValidationResult {
		const errors: string[] = []

		if (!name || name.trim().length === 0) {
			errors.push(PERMISSION_CONSTANTS.MESSAGES.VALIDATION.NAME_REQUIRED)
		} else {
			const trimmedName = name.trim()
			
			if (trimmedName.length > PERMISSION_CONSTANTS.VALIDATION.NAME.MAX_LENGTH) {
				errors.push(PERMISSION_CONSTANTS.MESSAGES.VALIDATION.NAME_TOO_LONG)
			}

			if (!PERMISSION_CONSTANTS.VALIDATION.NAME.PATTERN.test(trimmedName)) {
				errors.push(PERMISSION_CONSTANTS.MESSAGES.VALIDATION.NAME_INVALID)
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Validate module name
	 */
	static validateModule(module: string): ValidationResult {
		const errors: string[] = []

		if (!module || module.trim().length === 0) {
			errors.push(PERMISSION_CONSTANTS.MESSAGES.VALIDATION.MODULE_REQUIRED)
		} else {
			const trimmedModule = module.trim()
			
			if (trimmedModule.length > PERMISSION_CONSTANTS.VALIDATION.MODULE.MAX_LENGTH) {
				errors.push(PERMISSION_CONSTANTS.MESSAGES.VALIDATION.MODULE_TOO_LONG)
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Validate description
	 */
	static validateDescription(description?: string): ValidationResult {
		const errors: string[] = []

		if (description && description.trim().length > PERMISSION_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH) {
			errors.push(PERMISSION_CONSTANTS.MESSAGES.VALIDATION.DESCRIPTION_TOO_LONG)
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Validate create permission data
	 */
	static validateCreateData(data: CreatePermissionData): ValidationResult {
		const errors: string[] = []

		// Validate name
		const nameValidation = this.validateName(data.name)
		if (!nameValidation.isValid) {
			errors.push(...nameValidation.errors)
		}

		// Validate module
		const moduleValidation = this.validateModule(data.module)
		if (!moduleValidation.isValid) {
			errors.push(...moduleValidation.errors)
		}

		// Validate description if provided
		if (data.description) {
			const descriptionValidation = this.validateDescription(data.description)
			if (!descriptionValidation.isValid) {
				errors.push(...descriptionValidation.errors)
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Validate update permission data
	 */
	static validateUpdateData(data: UpdatePermissionData): ValidationResult {
		const errors: string[] = []

		// Validate name
		const nameValidation = this.validateName(data.name)
		if (!nameValidation.isValid) {
			errors.push(...nameValidation.errors)
		}

		// Validate module
		const moduleValidation = this.validateModule(data.module)
		if (!moduleValidation.isValid) {
			errors.push(...moduleValidation.errors)
		}

		// Validate description if provided
		if (data.description) {
			const descriptionValidation = this.validateDescription(data.description)
			if (!descriptionValidation.isValid) {
				errors.push(...descriptionValidation.errors)
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Sanitize permission name
	 */
	static sanitizeName(name: string): string {
		return name.trim().toUpperCase().replace(/\s+/g, '_')
	}

	/**
	 * Sanitize module name
	 */
	static sanitizeModule(module: string): string {
		return module.trim()
	}

	/**
	 * Sanitize description
	 */
	static sanitizeDescription(description?: string): string | undefined {
		return description?.trim() || undefined
	}

	/**
	 * Sanitize create permission data
	 */
	static sanitizeCreateData(data: CreatePermissionData): CreatePermissionData {
		return {
			name: this.sanitizeName(data.name),
			module: this.sanitizeModule(data.module),
			description: this.sanitizeDescription(data.description),
		}
	}

	/**
	 * Sanitize update permission data
	 */
	static sanitizeUpdateData(data: UpdatePermissionData): UpdatePermissionData {
		return {
			name: this.sanitizeName(data.name),
			module: this.sanitizeModule(data.module),
			description: this.sanitizeDescription(data.description),
		}
	}
}
