package com.jay.booking_service.mapper;

import com.jay.booking_service.dto.BookingDTO;
import com.jay.booking_service.model.Booking;

public class BookingMapper {

    public static BookingDTO toDTO(Booking booking)
    {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setSalonId(booking.getSalonId());
        bookingDTO.setCustomerId(booking.getCustomerId());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setEndTime(booking.getEndTime());
        bookingDTO.setStartTime(booking.getStartTime());
        
        bookingDTO.setServiceIds(booking.getServiceIds());
        bookingDTO.setTotalPrice(booking.getTotalPrice());
        bookingDTO.setPaymentMethod(booking.getPaymentMethod());
        bookingDTO.setBookingDate(booking.getBookingDate());
        return bookingDTO;
    }

    public static BookingDTO toDTO(Booking booking, String serviceName) {
        BookingDTO bookingDTO = toDTO(booking);
        bookingDTO.setServiceName(serviceName);
        return bookingDTO;
    }
}
