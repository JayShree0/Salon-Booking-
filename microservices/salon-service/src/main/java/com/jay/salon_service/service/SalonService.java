package com.jay.salon_service.service;

import com.jay.salon_service.dto.SalonDTO;
import com.jay.salon_service.dto.UserDTO;
import com.jay.salon_service.model.Salon;

import java.util.List;

public interface SalonService {

    Salon createSalon(SalonDTO salon, UserDTO user);

    Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception;

    List<Salon> getAllSalons();

    Salon getSalonById(Long salonId) throws Exception;

    Salon getSalonByOwnerId(Long ownerId);

    List<Salon> searchSalonByCity(String city);

    void deleteSalon(Long salonId) throws Exception;

}
