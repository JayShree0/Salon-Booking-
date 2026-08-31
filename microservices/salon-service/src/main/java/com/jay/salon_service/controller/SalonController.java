package com.jay.salon_service.controller;

import com.jay.salon_service.dto.SalonDTO;
import com.jay.salon_service.dto.UserDTO;
import com.jay.salon_service.mapper.SalonMapper;
import com.jay.salon_service.model.Salon;
import com.jay.salon_service.service.SalonService;
import com.jay.salon_service.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
public class SalonController {

    private final SalonService salonService;
    private final UserFeignClient userFeignClient;

    // http://localhost:5002/api/salons
    @PostMapping
    public ResponseEntity<SalonDTO> createSalon(
            @RequestBody SalonDTO salonDTO,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        Salon salon = salonService.createSalon(salonDTO, userDTO);
        SalonDTO salonDTO1 = SalonMapper.mapToDto(salon);
        return ResponseEntity.ok(salonDTO1);
    }

    @PutMapping("/{salonId}")
    public ResponseEntity<SalonDTO> updateSalon(
            @PathVariable Long salonId,
            @RequestBody SalonDTO salonDTO,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        Salon salon = salonService.updateSalon(salonDTO, userDTO, salonId);
        SalonDTO salonDTO1 = SalonMapper.mapToDto(salon);
        return ResponseEntity.ok(salonDTO1);
    }

    // get all the salon
    @GetMapping
    public ResponseEntity<List<SalonDTO>> getSalons(
    ) throws Exception {

        /*
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        List<Salon> salons = salonService.getAllSalons();

        List<SalonDTO> salonDTOS = salons
                .stream()
                .map((salon) -> {
                    SalonDTO salonDTO = SalonMapper.mapToDto(salon);
                    return salonDTO;
                })
                .toList();

        return ResponseEntity.ok(salonDTOS);

        */
        List<Salon> salons = salonService.getAllSalons();
        List<SalonDTO> salonDTOS = salons.stream().map((salon -> {
            SalonDTO salonDTO = SalonMapper.mapToDto(salon);
            return salonDTO;
        })).toList();

        return ResponseEntity.ok(salonDTOS);
    }

    // search the salon
    @GetMapping("/search")
    public ResponseEntity<List<SalonDTO>> searchSalons(
            @RequestParam("city") String city
    ) throws Exception {

        List<Salon> salons = salonService.searchSalonByCity(city);

        List<SalonDTO> salonDTOS = salons
                .stream()
                .map((salon) -> {
                    SalonDTO salonDTO = SalonMapper.mapToDto(salon);
                    return salonDTO;
                }).toList();

        return ResponseEntity.ok(salonDTOS);
    }

    @GetMapping("/owner")
    public ResponseEntity<SalonDTO> getSalonByOwnerId(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        if(userDTO == null) {
            throw new Exception("User not found from jwt");
        }
        Salon salon = salonService.getSalonByOwnerId(userDTO.getId());

        SalonDTO salonDTO = SalonMapper.mapToDto(salon);

        return ResponseEntity.ok(salonDTO);
    }


    // get salon by id
    // http://localhost:5002/api/salons/1
    @GetMapping("/{salonId}")
    public ResponseEntity<SalonDTO> getSalonById(
            @PathVariable Long salonId) throws Exception
    {
        Salon salon = salonService.getSalonById(salonId);
        SalonDTO salonDTO = SalonMapper.mapToDto(salon);
        return ResponseEntity.ok(salonDTO);
    }


    // delete salon by id
    @DeleteMapping("/{salonId}")
    public ResponseEntity<String> deleteSalon(
            @PathVariable Long salonId) throws Exception {
        salonService.deleteSalon(salonId);
        return ResponseEntity.ok("Salon deleted successfully");
    }
}
