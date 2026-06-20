package com.jay.booking_service.service;

import com.jay.booking_service.domain.BookingStatus;
import com.jay.booking_service.dto.BookingRequest;
import com.jay.booking_service.dto.SalonDTO;
import com.jay.booking_service.dto.ServiceDTO;
import com.jay.booking_service.dto.UserDTO;
import com.jay.booking_service.model.Booking;
import com.jay.booking_service.model.SalonReport;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface BookingService {

    // Create a new booking
    Booking createBooking(BookingRequest request,
                          UserDTO user,
                          SalonDTO salon,
                          Set<ServiceDTO> serviceDTOSet) throws Exception;

    // Get all bookings of a customer
    List<Booking> getBookingByCustomer(Long customerId);

    // Get all bookings of a salon
    List<Booking> getBookingsBySalon(Long salonId);

    // Get booking by ID
    Booking getBookingById(Long id) throws Exception;

    // Update booking status
    Booking updateBookingStatus(Long bookingId, BookingStatus status) throws Exception;

    // Get bookings by date for a salon
    List<Booking> getBookingByDate(LocalDate date, Long salonId);

    // Get salon report (analytics)
    SalonReport getSalonReport(Long salonId);

}