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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required.");
        }

        if (user.getRole() == null || !"CUSTOMER".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only customers are permitted to create bookings. Salon owners cannot create customer bookings."
            );
        }

        SalonDTO salon = salonFeignClient.getSalonById(salonId).getBody();

        Set<ServiceDTO> serviceDTOSet = serviceOfferingFeignClient.getServiceByIds(bookingRequest.getServiceIds()).getBody();

        if (serviceDTOSet == null || serviceDTOSet.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No services selected for booking.");
        }

        Booking booking = bookingService.createBooking(
                bookingRequest,
                user,
                salon,
                serviceDTOSet);

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
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required.");
        }
        if (user.getRole() == null || !"CUSTOMER".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only customers can access customer bookings.");
        }
        List<Booking> bookings = bookingService.getBookingByCustomer(user.getId());
        return ResponseEntity.ok(getBookingDTOs(bookings));
    }

    @GetMapping("/salon")
    public ResponseEntity<Set<BookingDTO>> getBookingBySalon(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        List<Booking> bookings = bookingService.getBookingsBySalon(salonDTO.getId());

        return ResponseEntity.ok(getBookingDTOs(bookings));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingsById(
            @PathVariable("bookingId") Long bookingId,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        Booking booking = bookingService.getBookingById(bookingId);
        if (jwt != null && !jwt.isBlank()) {
            try {
                UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
                if (user != null && user.getId() != null) {
                    boolean isCustomer = "CUSTOMER".equalsIgnoreCase(user.getRole()) && user.getId().equals(booking.getCustomerId());
                    boolean isOwner = false;
                    if ("SALON_OWNER".equalsIgnoreCase(user.getRole())) {
                        try {
                            SalonDTO ownerSalon = salonFeignClient.getSalonByOwnerId(jwt).getBody();
                            if (ownerSalon != null && ownerSalon.getId().equals(booking.getSalonId())) {
                                isOwner = true;
                            }
                        } catch (Exception ignored) {}
                    }
                    boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

                    if (!isCustomer && !isOwner && !isAdmin) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this booking record.");
                    }
                }
            } catch (ResponseStatusException rse) {
                throw rse;
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(BookingMapper.toDTO(booking));
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        if (jwt != null && !jwt.isBlank()) {
            UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
            if (user != null && user.getId() != null) {
                Booking booking = bookingService.getBookingById(bookingId);
                boolean isCustomer = "CUSTOMER".equalsIgnoreCase(user.getRole()) && user.getId().equals(booking.getCustomerId());
                boolean isOwner = false;
                if ("SALON_OWNER".equalsIgnoreCase(user.getRole())) {
                    try {
                        SalonDTO ownerSalon = salonFeignClient.getSalonByOwnerId(jwt).getBody();
                        if (ownerSalon != null && ownerSalon.getId().equals(booking.getSalonId())) {
                            isOwner = true;
                        }
                    } catch (Exception ignored) {}
                }
                boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

                if (isCustomer) {
                    if (status != BookingStatus.CANCELLED) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customers are only permitted to cancel their own bookings.");
                    }
                } else if (!isOwner && !isAdmin) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to update booking status for this salon.");
                }
            }
        }
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
