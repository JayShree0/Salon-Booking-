package com.jay.salon_service.service.impl;

import com.jay.salon_service.dto.SalonDTO;
import com.jay.salon_service.dto.UserDTO;
import com.jay.salon_service.model.Salon;
import com.jay.salon_service.repository.SalonRepository;
import com.jay.salon_service.service.SalonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalonServiceImpl implements SalonService {

    private final SalonRepository salonRepository;

    @Override
    public Salon createSalon(SalonDTO salonDTO, UserDTO user) {

        // before creating the check the salon
        Salon salon = new Salon();
        salon.setName(salonDTO.getName());
        salon.setAddress(salonDTO.getAddress());
        salon.setEmail(salonDTO.getEmail());
        salon.setCity(salonDTO.getCity());
        salon.setPhoneNumber(salonDTO.getPhoneNumber());
        salon.setImages(salonDTO.getImages());
        salon.setOwnerId(user.getId());
        salon.setOpenTime(salonDTO.getOpenTime());
        salon.setCloseTime(salonDTO.getCloseTime());
        return salonRepository.save(salon);
    }

    @Override
    public Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception {

        Salon existingSalon = salonRepository.findById(salonId)
                .orElseThrow(() -> new Exception("Salon not exist"));

        //  Check ownership using existingSalon
        if (!existingSalon.getOwnerId().equals(user.getId())) {
            throw new Exception("You don't have permission to update this salon");
        }

        existingSalon.setCity(salon.getCity());
        existingSalon.setName(salon.getName());
        existingSalon.setAddress(salon.getAddress());
        existingSalon.setEmail(salon.getEmail());
        existingSalon.setPhoneNumber(salon.getPhoneNumber());
        existingSalon.setImages(salon.getImages());
        existingSalon.setOwnerId(user.getId());
        existingSalon.setOpenTime(salon.getOpenTime());
        existingSalon.setCloseTime(salon.getCloseTime());

        return salonRepository.save(existingSalon);
    }

    @Override
    public List<Salon> getAllSalons() {
        return salonRepository.findAll();
    }

    @Override
    public Salon getSalonById(Long salonId) throws Exception {
        return salonRepository.findById(salonId)
                .orElseThrow(()-> new Exception("Salon not exists"));
    }

    @Override
    public Salon getSalonByOwnerId(Long ownerId) {
        return salonRepository.findByOwnerId(ownerId);
    }

    @Override
    public List<Salon> searchSalonByCity(String city) {
        return salonRepository.searchSalons(city);
    }

    private Salon mapToEntity(SalonDTO salonDTO) {

        Salon salon = new Salon();
        salon.setName(salonDTO.getName());
        salon.setAddress(salonDTO.getAddress());
        salon.setEmail(salonDTO.getEmail());
        salon.setCity(salonDTO.getCity());
        salon.setPhoneNumber(salonDTO.getPhoneNumber());
        salon.setImages(salonDTO.getImages());
        salon.setOwnerId(salonDTO.getOwnerId());
        salon.setOpenTime(salonDTO.getOpenTime());
        salon.setCloseTime(salonDTO.getCloseTime());

        return salonRepository.save(salon);
    }
}
