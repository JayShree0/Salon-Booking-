package com.jay.service_offering.service;

import com.jay.service_offering.dto.CategoryDTO;
import com.jay.service_offering.dto.SalonDTO;
import com.jay.service_offering.dto.ServiceDTO;
import com.jay.service_offering.model.ServiceOffering;

import java.util.List;
import java.util.Set;

public interface ServiceOfferingService {

    // Create a new service offering
    ServiceOffering createService(SalonDTO salonDTO,
                                  ServiceDTO serviceDTO,
                                  CategoryDTO categoryDTO);


    // Update an existing service
    ServiceOffering updateService(Long serviceId, ServiceOffering service) throws Exception;

    // Get all services by salon ID and optionally filter by category ID
    Set<ServiceOffering> getAllServiceBySalonId(Long salonId, Long categoryId);

    // Get multiple services using their IDs
    Set<ServiceOffering> getServicesByIds(Set<Long> ids);

    // get the service by ID
    ServiceOffering getServiceById(Long id) throws Exception;

}
