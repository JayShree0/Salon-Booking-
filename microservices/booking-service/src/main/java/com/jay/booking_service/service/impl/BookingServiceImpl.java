package com.jay.booking_service.service.impl;

import com.jay.booking_service.domain.BookingStatus;
import com.jay.booking_service.dto.BookingRequest;
import com.jay.booking_service.dto.SalonDTO;
import com.jay.booking_service.dto.ServiceDTO;
import com.jay.booking_service.dto.UserDTO;
import com.jay.booking_service.model.Booking;
import com.jay.booking_service.model.SalonReport;
import com.jay.booking_service.repository.BookingRepository;
import com.jay.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(BookingRequest booking, UserDTO user, SalonDTO salon, Set<ServiceDTO> services) throws Exception {
        // before creating booking, we should check if the requested time slot is available for the salon and services
        // this involves checking existing bookings for the salon and services during the requested time slot
        // if the time slot is available, we can proceed to create the booking

        // 1. Calculate total service duration
        int totalDuration = services
                .stream()
                .mapToInt(ServiceDTO::getDuration)
                .sum();

        // 2. Calculate start & end time
        LocalDateTime bookingStartTime = booking.getStartTime();
        LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(totalDuration);
        LocalDate bookingDate = bookingStartTime.toLocalDate();

        Boolean isSlotAvailable = isTimeSlotAvailable(salon, bookingStartTime, bookingEndTime);

        int totalPrice = services
                .stream()
                .mapToInt(ServiceDTO::getPrice)
                .sum();

        Set<Long> idList = services
                .stream()
                .map(ServiceDTO::getId)
                .collect(Collectors.toSet());

        Booking newBooking = new Booking();
        newBooking.setCustomerId(user.getId());
        newBooking.setSalonId(salon.getId());
        newBooking.setServiceIds(idList);
        newBooking.setStatus(BookingStatus.PENDING);
        newBooking.setStartTime(bookingStartTime);
        newBooking.setEndTime(bookingEndTime);
        newBooking.setTotalPrice(totalPrice);
        newBooking.setBookingDate(bookingDate);


        return bookingRepository.save(newBooking);
    }

    public Boolean isTimeSlotAvailable(SalonDTO salonDTO,
                                       LocalDateTime bookingStartTime,
                                       LocalDateTime bookingEndTime) throws Exception {

        // Whether your requested time falls within the salon's working hours
        LocalDateTime salonOpenTime = salonDTO.getOpenTime().atDate(bookingStartTime.toLocalDate());
        LocalDateTime salonCloseTime = salonDTO.getCloseTime().atDate(bookingStartTime.toLocalDate());

        if (bookingStartTime.isBefore(salonOpenTime) ||
                bookingEndTime.isAfter(salonCloseTime)) {

            throw new Exception("Requested time slot is outside salon working hours");
        }

        // Whether your requested time overlaps with any existing bookings for the salon
        List<Booking> existingBookings = getBookingsBySalon(salonDTO.getId());
        for (Booking existingBooking : existingBookings) {
            LocalDateTime existingBookingStartTime = existingBooking.getStartTime();
            LocalDateTime existingBookingEndTime = existingBooking.getEndTime();

            if (bookingStartTime.isBefore(existingBookingEndTime)
                    && bookingEndTime.isAfter(existingBookingStartTime)) {
                throw new Exception("Requested time slot overlaps with an existing booking");
            }

            if (bookingStartTime.isEqual(existingBookingStartTime)
                    || bookingEndTime.isEqual(existingBookingEndTime)) {
                throw new Exception("Requested time slot overlaps with an existing booking");
            }
        }
        return true;

    }

    @Override
    public List<Booking> getBookingByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Booking> getBookingsBySalon(Long salonId) {
        return bookingRepository.findBySalonId(salonId);
    }

    @Override
    public Booking getBookingById(Long id) throws RuntimeException {

        Booking booking = bookingRepository.findById(id)
                .orElse(null);
        if (booking == null) {
            throw new RuntimeException("Booking not found with id: " + id);
        }

        return booking;
    }

    @Override
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElse(null);
        if (booking == null) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);

    }

    @Override
    public List<Booking> getBookingByDate(LocalDate date, Long salonId) {
        if (date == null) {
            return getBookingsBySalon(salonId);
        }

        return bookingRepository.findBySalonIdAndBookingDate(salonId, date);
    }

    /*

    @Override
    public SalonReport getSalonReport(Long salonId) {

        List<Booking> bookings = getBookingsBySalon(salonId);

        // total earnings
        Double totalEarnings = bookings.stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        Integer totalBookings = bookings.size();

        List<Booking> cancelledBookings = bookings
                .stream()
                .filter(booking -> booking.getStatus().equals(BookingStatus.CANCELLED))
                .collect(Collectors.toList());

        Double totalRefund = cancelledBookings.stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();


        SalonReport report = new SalonReport();
        report.setSalonId(salonId);
        report.setTotalEarnings(totalEarnings);
        report.setTotalBookings(totalBookings);
        report.setCancelledBookings(cancelledBookings.size());
        report.setTotalRefunds(totalRefund);

        return report;
    }

     */

    @Override
    public SalonReport getSalonReport(Long salonId) {

        List<Booking> bookings = getBookingsBySalon(salonId);

        double totalEarnings = 0;
        double totalRefunds = 0;
        int cancelledCount = 0;

        for (Booking booking : bookings) {

            if (booking.getStatus() == BookingStatus.CANCELLED) {
                cancelledCount++;
                totalRefunds += booking.getTotalPrice();
            } else {
                totalEarnings += booking.getTotalPrice();
            }
        }

        SalonReport report = new SalonReport();
        report.setSalonId(salonId);
        report.setTotalEarnings(totalEarnings);
        report.setTotalBookings(bookings.size());
        report.setCancelledBookings(cancelledCount);
        report.setTotalRefunds(totalRefunds);

        return report;
    }
}
