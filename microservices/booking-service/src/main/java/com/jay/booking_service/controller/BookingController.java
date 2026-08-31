package com.jay.booking_service.controller;

import com.jay.booking_service.domain.BookingStatus;
import com.jay.booking_service.domain.PaymentMethod;
import com.jay.booking_service.dto.*;
import com.jay.booking_service.mapper.BookingMapper;
import com.jay.booking_service.model.Booking;
import com.jay.booking_service.model.SalonReport;
import com.jay.booking_service.service.BookingService;
import com.jay.booking_service.service.client.PaymentFeignClient;
import com.jay.booking_service.service.client.SalonFeignClient;
import com.jay.booking_service.service.client.ServiceOfferingFeignClient;
import com.jay.booking_service.service.client.UserFeignClient;
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
    private final SalonFeignClient salonFeignClient;
    private final UserFeignClient userFeignClient;
    private final ServiceOfferingFeignClient serviceOfferingFeignClient;
    private final PaymentFeignClient paymentFeignClient;

    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createBooking(
            @RequestParam Long salonId,
            @RequestParam PaymentMethod paymentMethod,
            @RequestBody BookingRequest bookingRequest,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();


        SalonDTO salon = salonFeignClient.getSalonById(salonId).getBody();

        Set<ServiceDTO> serviceDTOSet = serviceOfferingFeignClient.getServiceByIds(bookingRequest.getServiceIds()).getBody();

        Booking booking = bookingService.createBooking(
                bookingRequest,
                user,
                salon,
                serviceDTOSet);

        if(serviceDTOSet.isEmpty()) {
            throw new Exception("service not found ...");
        }

        BookingDTO bookingDTO = BookingMapper.toDTO(booking);

        PaymentLinkResponse response = paymentFeignClient.createPaymentLink(
                bookingDTO,
                paymentMethod,
                jwt
        ).getBody();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer")
    public ResponseEntity<Set<BookingDTO>> getBookingsByCustomer(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        if (user == null || user.getId() == null) {
            throw new Exception("user not found from jwt....");
        }
        List<Booking> bookings = bookingService.getBookingByCustomer(user.getId());
        return ResponseEntity.ok(getBookingDTOs(bookings));
    }

    @GetMapping("/salon")
    public ResponseEntity<Set<BookingDTO>> getBookingBySalon(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        List<Booking> bookings = bookingService.getBookingsBySalon(salonDTO.getId()); // Mocked salon ID, replace with actual salon ID

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
    public ResponseEntity<List<BookingSlotDTO>> getBookedSlot( // getBookingByDate
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
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        SalonReport report = bookingService.getSalonReport(salonDTO.getId()); // Mocked salon ID, replace with actual salon ID


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
