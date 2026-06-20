package com.jay.service_offering.service.impl;

import com.jay.service_offering.dto.CategoryDTO;
import com.jay.service_offering.dto.SalonDTO;
import com.jay.service_offering.dto.ServiceDTO;
import com.jay.service_offering.model.ServiceOffering;
import com.jay.service_offering.repository.ServiceOfferingRepository;
import com.jay.service_offering.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOfferingImpl implements ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;

    @Override
    public ServiceOffering createService(SalonDTO salonDTO, ServiceDTO serviceDTO, CategoryDTO categoryDTO) {
        ServiceOffering serviceOffering = new ServiceOffering();
        serviceOffering.setImage(serviceDTO.getImage());
        serviceOffering.setSalonId(salonDTO.getId());
        serviceOffering.setName(serviceDTO.getImage());
        serviceOffering.setDescription(serviceDTO.getDescription());
        serviceOffering.setCategoryId(categoryDTO.getId());
        serviceOffering.setPrice(serviceDTO.getPrice());
        serviceOffering.setDuration(serviceDTO.getDuration());

        return serviceOfferingRepository.save(serviceOffering);

    }

    @Override
    public ServiceOffering updateService(Long serviceId, ServiceOffering service) throws Exception {

        ServiceOffering serviceOffering = serviceOfferingRepository.findById(serviceId).orElse(null);
        if (serviceOffering == null) {
            throw new Exception("Service not exists with id " + serviceId);
        }
        serviceOffering.setImage(service.getImage());
        serviceOffering.setName(service.getImage());
        serviceOffering.setDescription(service.getDescription());
        serviceOffering.setPrice(service.getPrice());
        serviceOffering.setDuration(service.getDuration());

        return serviceOfferingRepository.save(serviceOffering);
    }

    @Override
    public Set<ServiceOffering> getAllServiceBySalonId(Long salonId, Long categoryId) {

        // Fetch all services for given salon
        Set<ServiceOffering> services = serviceOfferingRepository
                .findBySalonId(salonId);


        // If categoryId is provided, filter the services
        if (categoryId != null) {
            return services.stream()
                    .filter(service -> categoryId.equals(
                            service.getCategoryId()
                    ))
                    .collect(Collectors.toSet());
        }

        // If no category filter, return all services
        return services;
    }

    @Override
    public Set<ServiceOffering> getServicesByIds(Set<Long> ids) {
        List<ServiceOffering> services = serviceOfferingRepository.findAllById(ids);
        return new HashSet<>(services);
    }

    @Override
    public ServiceOffering getServiceById(Long id) throws Exception {
        ServiceOffering serviceOffering = serviceOfferingRepository.findById(id)
                .orElse(null);

        if (serviceOffering == null) {
            throw new Exception("Service not exists with id " + id);
        }
        return serviceOffering;
    }

}
