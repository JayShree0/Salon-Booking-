package com.jay.booking_service.repository;

import com.jay.booking_service.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findBySalonId(Long salonId);

    List<Booking> findBySalonIdAndBookingDate(Long salonId, LocalDate bookingDate);

}
