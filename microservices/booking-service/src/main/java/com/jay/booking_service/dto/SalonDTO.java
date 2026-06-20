package com.jay.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.time.chrono.ChronoLocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalonDTO {

    private Long id;
    private String name;
    private String email;
    private List<String> images;
    private String address;
    private String phoneNumber;
    private String city;
    private Long ownerId;
    private LocalTime openTime;
    private LocalTime closeTime;


}
