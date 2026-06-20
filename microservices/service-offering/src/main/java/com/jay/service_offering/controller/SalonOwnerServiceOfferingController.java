package com.jay.service_offering.controller;

import com.jay.service_offering.dto.CategoryDTO;
import com.jay.service_offering.dto.SalonDTO;
import com.jay.service_offering.dto.ServiceDTO;
import com.jay.service_offering.model.ServiceOffering;
import com.jay.service_offering.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/service-offering/salon-owner")
@RequiredArgsConstructor
public class SalonOwnerServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    @PostMapping
    public ResponseEntity<ServiceOffering> createService(
            @RequestBody ServiceDTO serviceDTO)
    {
        SalonDTO salonDTO = new SalonDTO();
        salonDTO.setId(1L);

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(serviceDTO.getCategory());

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
