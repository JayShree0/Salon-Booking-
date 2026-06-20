package com.jay.booking_service.controller;

import com.jay.booking_service.domain.BookingStatus;
import com.jay.booking_service.dto.*;
import com.jay.booking_service.mapper.BookingMapper;
import com.jay.booking_service.model.Booking;
import com.jay.booking_service.model.SalonReport;
import com.jay.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {


    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long salonId,
            @RequestBody BookingRequest bookingRequest
    ) throws Exception {
        UserDTO user = new UserDTO();
        user.setId(1L); // Mocked user ID, replace with actual authentication logic

        SalonDTO salon = new SalonDTO();
        salon.setId(salonId); // Mocked salon ID, replace with actual salon retrieval
        salon.setOpenTime(LocalTime.now()); // Mocked open time, replace with actual salon open time
        salon.setCloseTime(LocalTime.now().plusHours(12)); // Mocked close time

        Set<ServiceDTO> serviceDTOSet = new HashSet<>();

        ServiceDTO serviceDTO = new ServiceDTO();
        serviceDTO.setId(1L); // Mocked service ID, replace with actual service
        serviceDTO.setDuration(30); // Mocked duration, replace with actual service duration
        serviceDTO.setPrice(50); // Mocked price, replace with actual service price
        serviceDTO.setName("Hair cut for men"); // Mocked name, replace with actual service name
        serviceDTOSet.add(serviceDTO);

        Booking booking = bookingService.createBooking(bookingRequest, user, salon, serviceDTOSet);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/customer")
    public ResponseEntity<Set<BookingDTO>> getBookingsByCustomer(
    ) {
        List<Booking> bookings = bookingService.getBookingByCustomer(1L); // Mocked customer ID, replace with actual customer ID

        return ResponseEntity.ok(getBookingDTOs(bookings));
    }

    @GetMapping("/salon")
    public ResponseEntity<Set<BookingDTO>> getBookingBySalon(
    ) {
        List<Booking> bookings = bookingService.getBookingsBySalon(1L); // Mocked salon ID, replace with actual salon ID

        return ResponseEntity.ok(getBookingDTOs(bookings));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingsById(
            @PathVariable Long bookingId
    ) throws Exception {
        Booking bookings = bookingService.getBookingById(bookingId);

        return ResponseEntity.ok(BookingMapper.toDTO(bookings));
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status
    ) throws Exception {
        Booking bookings = bookingService.updateBookingStatus(bookingId, status);

        return ResponseEntity.ok(BookingMapper.toDTO(bookings));
    }

    @GetMapping("/slots/salon/{salonId}/date/{date}")
    public ResponseEntity<List<BookingSlotDTO>> getBookingByDate(
            @PathVariable Long salonId,
            @RequestParam(required = false) LocalDate date
    ) throws Exception {
        List<Booking> bookings = bookingService.getBookingByDate(date, salonId);

        List<BookingSlotDTO> bookingSlotDTOS = bookings
                .stream()
                .map(booking -> {
                    BookingSlotDTO slotDTO = new BookingSlotDTO();
                    slotDTO.setStartTime(booking.getStartTime());
                    slotDTO.setEndTime(booking.getEndTime());
                    return slotDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookingSlotDTOS);
    }

    @GetMapping("/report")
    public ResponseEntity<SalonReport> getSalonReport(
    ) throws Exception {
        SalonReport report = bookingService.getSalonReport(1L); // Mocked salon ID, replace with actual salon ID


        return ResponseEntity.ok(report);
    }

    private Set<BookingDTO> getBookingDTOs(List<Booking> bookings) {
        return bookings.stream()
                .map(booking -> {
                    return BookingMapper.toDTO(booking);
                })
                .collect(Collectors.toSet());
    }


}
