package com.jay.booking_service.service.client;

import com.jay.booking_service.dto.ServiceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Set;

@FeignClient("SERVICE-OFFERING")
public interface ServiceOfferingFeignClient {

    @GetMapping("/api/service-offering/list/{ids}")
    ResponseEntity<Set<ServiceDTO>> getServiceByIds(
            @PathVariable("ids") Set<Long> ids
    ) throws Exception;
}
