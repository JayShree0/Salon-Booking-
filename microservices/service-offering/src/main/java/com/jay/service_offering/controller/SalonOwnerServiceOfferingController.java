package com.jay.service_offering.controller;

import com.jay.service_offering.dto.CategoryDTO;
import com.jay.service_offering.dto.SalonDTO;
import com.jay.service_offering.dto.ServiceDTO;
import com.jay.service_offering.model.ServiceOffering;
import com.jay.service_offering.service.ServiceOfferingService;
import com.jay.service_offering.service.client.CategoryFeignClient;
import com.jay.service_offering.service.client.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/service-offering/salon-owner")
@RequiredArgsConstructor
public class SalonOwnerServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;
    private final SalonFeignClient salonFeignClient;
    private final CategoryFeignClient categoryFeignClient;

    @GetMapping
    public ResponseEntity<Set<ServiceOffering>> getServicesForSalonOwner(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();

        Set<ServiceOffering> serviceOfferings = serviceOfferingService
                .getAllServiceBySalonId(salonDTO.getId(), null);

        return ResponseEntity.ok(serviceOfferings);
    }

    @PostMapping
    public ResponseEntity<ServiceOffering> createService(
            @RequestBody ServiceDTO serviceDTO,
            @RequestHeader("Authorization") String jwt) throws Exception
    {
        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();

        CategoryDTO categoryDTO = categoryFeignClient
                .getCategoriesByIdAndSalon(serviceDTO.getCategory(), salonDTO.getId()).getBody();

        ServiceOffering serviceOfferings = serviceOfferingService
                .createService(salonDTO, serviceDTO, categoryDTO);

        return ResponseEntity.ok(serviceOfferings);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ServiceOffering> updateService(
            @PathVariable("id") Long serviceId,
            @RequestBody ServiceOffering serviceOffering) throws Exception {

        ServiceOffering serviceOfferings = serviceOfferingService
                .updateService(serviceId, serviceOffering);

        return ResponseEntity.ok(serviceOfferings);
    }
}
