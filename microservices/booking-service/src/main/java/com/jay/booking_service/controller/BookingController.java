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

import com.jay.booking_service.repository.BookingRepository;
import com.jay.booking_service.service.client.NotificationFeignClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final SalonFeignClient salonFeignClient;
    private final UserFeignClient userFeignClient;
    private final ServiceOfferingFeignClient serviceOfferingFeignClient;
    private final PaymentFeignClient paymentFeignClient;
    private final NotificationFeignClient notificationFeignClient;

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
        booking.setPaymentMethod(paymentMethod);
        boolean isCod = paymentMethod == PaymentMethod.CASH_ON_DELIVERY || paymentMethod == PaymentMethod.CASH;
        if (isCod) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
        booking = bookingRepository.save(booking);

        String serviceName = serviceDTOSet.stream()
                .map(ServiceDTO::getName)
                .filter(name -> name != null && !name.isBlank())
                .collect(Collectors.joining(", "));
        if (serviceName.isBlank()) {
            serviceName = "Salon Service";
        }

        // Notify customer that booking request has been created
        try {
            NotificationDTO notif = new NotificationDTO();
            notif.setUserId(user.getId());
            notif.setBookingId(booking.getId());
            notif.setSalonId(salon.getId());
            notif.setServiceName(serviceName);
            if (isCod) {
                notif.setType("BOOKING_CONFIRMED");
                notif.setDescription("Your " + serviceName + " appointment has been confirmed at " + salon.getName() + " (Pay at Salon).");
            } else {
                notif.setType("BOOKING_CREATED");
                notif.setDescription("Your booking request for " + serviceName + " at " + salon.getName() + " has been placed successfully.");
            }
            notificationFeignClient.createNotification(notif);
        } catch (Exception ignored) {}

        BookingDTO bookingDTO = BookingMapper.toDTO(booking, serviceName);

        PaymentLinkResponse response = paymentFeignClient.createPaymentLink(
                bookingDTO,
                paymentMethod,
                jwt
        ).getBody();
        if (response != null) {
            response.setBookingId(booking.getId());
        }
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
        Booking booking = null;
        try {
            booking = bookingService.getBookingById(bookingId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found with id " + bookingId);
        }
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
        if (booking == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found.");
        }
        String serviceName = resolveServiceName(booking.getServiceIds(), null);
        BookingDTO dto = BookingMapper.toDTO(booking, serviceName);
        dto.setBookingDate(booking.getBookingDate());
        try {
            SalonDTO salon = salonFeignClient.getSalonById(booking.getSalonId()).getBody();
            if (salon != null) {
                dto.setSalonName(salon.getName());
                dto.setSalonAddress(salon.getAddress());
            }
        } catch (Exception ignored) {}
        try {
            UserDTO customer = userFeignClient.getUserById(booking.getCustomerId(), jwt).getBody();
            if (customer != null) {
                dto.setCustomerName(customer.getFullName());
                dto.setCustomerEmail(customer.getEmail());
                dto.setCustomerPhone(customer.getPhone());
            }
        } catch (Exception ignored) {}
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        Booking currentBooking = bookingService.getBookingById(bookingId);
        if (currentBooking == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found.");
        }

        // 1. Validate status transitions
        BookingStatus currentStatus = currentBooking.getStatus();
        if (currentStatus == BookingStatus.COMPLETED || currentStatus == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already " + currentStatus + " and cannot be modified.");
        }
        if (currentStatus == status) {
            String sName = resolveServiceName(currentBooking.getServiceIds(), null);
            return ResponseEntity.ok(BookingMapper.toDTO(currentBooking, sName));
        }
        if (currentStatus == BookingStatus.PENDING && status != BookingStatus.CONFIRMED && status != BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pending bookings can only be confirmed or cancelled.");
        }
        if (currentStatus == BookingStatus.CONFIRMED && status != BookingStatus.COMPLETED && status != BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confirmed bookings can only be completed or cancelled.");
        }

        boolean isCustomer = false;
        if (jwt != null && !jwt.isBlank()) {
            UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
            if (user != null && user.getId() != null) {
                isCustomer = "CUSTOMER".equalsIgnoreCase(user.getRole()) && user.getId().equals(currentBooking.getCustomerId());
                boolean isOwner = false;
                if ("SALON_OWNER".equalsIgnoreCase(user.getRole())) {
                    try {
                        SalonDTO ownerSalon = salonFeignClient.getSalonByOwnerId(jwt).getBody();
                        if (ownerSalon != null && ownerSalon.getId().equals(currentBooking.getSalonId())) {
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
        String serviceName = resolveServiceName(bookings.getServiceIds(), null);

        // Notify customer on status update
        try {
            SalonDTO salon = null;
            try {
                salon = salonFeignClient.getSalonById(bookings.getSalonId()).getBody();
            } catch (Exception ignored) {}
            String salonName = salon != null && salon.getName() != null ? salon.getName() : "the salon";

            if (status == BookingStatus.CONFIRMED) {
                NotificationDTO notif = new NotificationDTO();
                notif.setUserId(bookings.getCustomerId());
                notif.setBookingId(bookings.getId());
                notif.setSalonId(bookings.getSalonId());
                notif.setServiceName(serviceName);
                notif.setType("BOOKING_CONFIRMED");
                notif.setDescription("Your " + serviceName + " appointment has been confirmed by " + salonName + ".");
                notificationFeignClient.createNotification(notif);
            } else if (status == BookingStatus.CANCELLED) {
                NotificationDTO notif = new NotificationDTO();
                notif.setUserId(bookings.getCustomerId());
                notif.setBookingId(bookings.getId());
                notif.setSalonId(bookings.getSalonId());
                notif.setServiceName(serviceName);
                notif.setType("BOOKING_CANCELLED");
                if (isCustomer) {
                    notif.setDescription("Your " + serviceName + " appointment at " + salonName + " has been cancelled as requested.");
                } else {
                    notif.setDescription("Your " + serviceName + " appointment at " + salonName + " has been cancelled by " + salonName + ".");
                }
                notificationFeignClient.createNotification(notif);

                // If booking had an amount AND was not an unpaid COD booking, dispatch refund notification
                boolean isCod = bookings.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY || bookings.getPaymentMethod() == PaymentMethod.CASH;
                if (!isCod && bookings.getTotalPrice() > 0) {
                    NotificationDTO refundNotif = new NotificationDTO();
                    refundNotif.setUserId(bookings.getCustomerId());
                    refundNotif.setBookingId(bookings.getId());
                    refundNotif.setSalonId(bookings.getSalonId());
                    refundNotif.setServiceName(serviceName);
                    refundNotif.setType("REFUND_INITIATED");
                    refundNotif.setDescription("Payment of ₹" + bookings.getTotalPrice() + " for " + serviceName + " has been refunded.");
                    notificationFeignClient.createNotification(refundNotif);
                }
            } else if (status == BookingStatus.COMPLETED) {
                // If COD, record cash collection in payment-service
                boolean isCod = bookings.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY || bookings.getPaymentMethod() == PaymentMethod.CASH;
                if (isCod) {
                    try {
                        paymentFeignClient.completeCashPayment(bookings.getId());
                    } catch (Exception ignored) {}
                }

                NotificationDTO notif = new NotificationDTO();
                notif.setUserId(bookings.getCustomerId());
                notif.setBookingId(bookings.getId());
                notif.setSalonId(bookings.getSalonId());
                notif.setServiceName(serviceName);
                notif.setType("BOOKING_COMPLETED");
                notif.setDescription("Your " + serviceName + " appointment at " + salonName + " has been completed successfully.");
                notificationFeignClient.createNotification(notif);
            }
        } catch (Exception ignored) {}

        return ResponseEntity.ok(BookingMapper.toDTO(bookings, serviceName));
    }

    // Appointment Reminders endpoint & scheduled trigger
    @PostMapping("/reminders/trigger")
    public ResponseEntity<Map<String, Object>> triggerAppointmentReminders() {
        int count = checkAndSendUpcomingAppointmentReminders();
        return ResponseEntity.ok(Map.of("message", "Appointment reminders processed", "sentCount", count));
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 1800000)
    public void scheduledAppointmentReminders() {
        checkAndSendUpcomingAppointmentReminders();
    }

    private int checkAndSendUpcomingAppointmentReminders() {
        int count = 0;
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime next24Hours = now.plusHours(24);
            List<Booking> upcoming = bookingRepository.findByStatusAndStartTimeBetween(BookingStatus.CONFIRMED, now, next24Hours);
            for (Booking b : upcoming) {
                try {
                    SalonDTO salon = salonFeignClient.getSalonById(b.getSalonId()).getBody();
                    String salonName = salon != null && salon.getName() != null ? salon.getName() : "the salon";
                    String serviceName = resolveServiceName(b.getServiceIds(), null);
                    NotificationDTO notif = new NotificationDTO();
                    notif.setUserId(b.getCustomerId());
                    notif.setBookingId(b.getId());
                    notif.setSalonId(b.getSalonId());
                    notif.setServiceName(serviceName);
                    notif.setType("APPOINTMENT_REMINDER");
                    notif.setDescription("Reminder: Your upcoming " + serviceName + " appointment at " + salonName + " is scheduled for " + b.getStartTime() + ".");
                    notificationFeignClient.createNotification(notif);
                    count++;
                } catch (Exception ignored) {}
            }
        } catch (Exception ignored) {}
        return count;
    }

    private String resolveServiceName(Set<Long> serviceIds, Map<Long, String> cache) {
        if (serviceIds == null || serviceIds.isEmpty()) {
            return "Salon Service";
        }
        if (cache != null && !cache.isEmpty()) {
            String joined = serviceIds.stream()
                    .map(cache::get)
                    .filter(name -> name != null && !name.isBlank())
                    .collect(Collectors.joining(", "));
            if (!joined.isBlank()) {
                return joined;
            }
        }
        try {
            Set<ServiceDTO> services = serviceOfferingFeignClient.getServiceByIds(serviceIds).getBody();
            if (services != null && !services.isEmpty()) {
                String joined = services.stream()
                        .map(ServiceDTO::getName)
                        .filter(name -> name != null && !name.isBlank())
                        .collect(Collectors.joining(", "));
                if (!joined.isBlank()) {
                    return joined;
                }
            }
        } catch (Exception ignored) {}
        return "Salon Service";
    }

    private Map<Long, String> batchFetchServiceNames(List<Booking> bookings) {
        if (bookings == null || bookings.isEmpty()) {
            return java.util.Collections.emptyMap();
        }
        Set<Long> allServiceIds = bookings.stream()
                .filter(b -> b.getServiceIds() != null)
                .flatMap(b -> b.getServiceIds().stream())
                .collect(Collectors.toSet());
        if (allServiceIds.isEmpty()) {
            return java.util.Collections.emptyMap();
        }
        try {
            Set<ServiceDTO> services = serviceOfferingFeignClient.getServiceByIds(allServiceIds).getBody();
            if (services != null) {
                return services.stream()
                        .filter(s -> s.getId() != null && s.getName() != null)
                        .collect(Collectors.toMap(ServiceDTO::getId, ServiceDTO::getName, (a, b) -> a));
            }
        } catch (Exception ignored) {}
        return java.util.Collections.emptyMap();
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
        Map<Long, String> cache = batchFetchServiceNames(bookings);
        return bookings.stream()
                .map(booking -> {
                    String serviceName = resolveServiceName(booking.getServiceIds(), cache);
                    return BookingMapper.toDTO(booking, serviceName);
                })
                .collect(Collectors.toSet());
    }


}
