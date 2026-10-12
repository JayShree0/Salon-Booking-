package com.jay.user_service.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<UserRole, String> {

    @Override
    public String convertToDatabaseColumn(UserRole attribute) {
        if (attribute == null) {
            return UserRole.CUSTOMER.name();
        }
        return attribute.name();
    }

    @Override
    public UserRole convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return UserRole.CUSTOMER;
        }
        try {
            return UserRole.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle variations like ROLE_CUSTOMER, ROLE_SALON_OWNER
            String normalized = dbData.trim().toUpperCase();
            if (normalized.startsWith("ROLE_")) {
                normalized = normalized.substring(5);
            }
            try {
                return UserRole.valueOf(normalized);
            } catch (IllegalArgumentException ex) {
                return UserRole.CUSTOMER;
            }
        }
    }
}

