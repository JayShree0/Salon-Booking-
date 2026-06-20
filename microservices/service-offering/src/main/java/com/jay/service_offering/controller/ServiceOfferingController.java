package com.jay.service_offering.controller;

import com.jay.service_offering.model.ServiceOffering;
import com.jay.service_offering.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/service-offering")
@RequiredArgsConstructor
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<Set<ServiceOffering>> getServiceBySalonId(
            @PathVariable Long salonId,
            @RequestParam(required = false) Long categoryId
    ) {

        Set<ServiceOffering> serviceOfferings =
                serviceOfferingService.getAllServiceBySalonId(salonId, categoryId);

        return ResponseEntity.ok(serviceOfferings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOffering> getServiceById(
            @PathVariable Long id
    ) throws Exception {

        ServiceOffering serviceOffering =
                serviceOfferingService.getServiceById(id);

        return ResponseEntity.ok(serviceOffering);
    }

    @GetMapping("/list/{ids}")
    public ResponseEntity<Set<ServiceOffering>> getServiceByIds(
            @PathVariable Set<Long> ids
    ) throws Exception {

        Set<ServiceOffering> serviceOfferings =
                serviceOfferingService.getServicesByIds(ids);

        return ResponseEntity.ok(serviceOfferings);
    }
}