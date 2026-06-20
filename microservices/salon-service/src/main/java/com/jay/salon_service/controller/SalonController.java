package com.jay.salon_service.controller;

import com.jay.salon_service.dto.SalonDTO;
import com.jay.salon_service.dto.UserDTO;
import com.jay.salon_service.mapper.SalonMapper;
import com.jay.salon_service.model.Salon;
import com.jay.salon_service.service.SalonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
public class SalonController {

    private final SalonService salonService;

    // http://localhost:5002/api/salons
    @PostMapping
    public ResponseEntity<SalonDTO> createSalon(@RequestBody SalonDTO salonDTO) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        /*
        i am creating static dto .. because when we integrate eclock in our application we will get one jwt token inside request header.. wha se we will grab the userId [details]
         */
        Salon salon = salonService.createSalon(salonDTO, userDTO);
        SalonDTO salonDTO1 = SalonMapper.mapToDto(salon);
        return ResponseEntity.ok(salonDTO1);
    }

    @PutMapping("/{salonId}")
    public ResponseEntity<SalonDTO> updateSalon(
            @PathVariable Long salonId,
            @RequestBody SalonDTO salonDTO) throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        /*
        i am creating static dto .. because when we integrate eclock in our application we will get one jwt token inside request header.. wha se we will grab the userId [details]
         */
        Salon salon = salonService.updateSalon(salonDTO, userDTO, salonId);
        SalonDTO salonDTO1 = SalonMapper.mapToDto(salon);
        return ResponseEntity.ok(salonDTO1);
    }

    // get all the salon
    @GetMapping
    public ResponseEntity<List<SalonDTO>> getSalons(
    ) throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        /*
        i am creating static dto, because when we integrate keyClock in our application we will get one jwt token inside request header.. wha se we will grab the userId [details]
         */
        List<Salon> salons = salonService.getAllSalons();

        List<SalonDTO> salonDTOS = salons
                .stream()
                .map((salon) -> {
                    SalonDTO salonDTO = SalonMapper.mapToDto(salon);
                    return salonDTO;
                })
                .toList();

        return ResponseEntity.ok(salonDTOS);
    }

    // search the salon
    @GetMapping("/search")
    public ResponseEntity<List<SalonDTO>> searchSalons(
            @RequestParam("city") String city
    ) throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

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
            @PathVariable Long salonId
    ) throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        Salon salon = salonService.getSalonByOwnerId(userDTO.getId());

        SalonDTO salonDTO = SalonMapper.mapToDto(salon);

        return ResponseEntity.ok(salonDTO);
    }


    // get salon by id
    // http://localhost:5502/api/salons/1
    @GetMapping("/{salonId}")
    public ResponseEntity<SalonDTO> getSalonById(
            @PathVariable Long salonId) throws Exception
    {
        Salon salon = salonService.getSalonById(salonId);
        SalonDTO salonDTO = SalonMapper.mapToDto(salon);
        return ResponseEntity.ok(salonDTO);
    }

}
