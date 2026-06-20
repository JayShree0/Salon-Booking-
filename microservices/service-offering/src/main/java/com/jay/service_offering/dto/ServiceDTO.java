package com.jay.service_offering.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {

    private Long id;
    private String name;
    private String description;
    private int price;
    private int duration;
    private Long salonId;
    private Long category;
    private String image;
}
