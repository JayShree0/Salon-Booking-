package com.jay.booking_service.dto;

import lombok.Data;

@Data
public class PaymentLinkResponse {

    private String payment_link_url;
    private String getPayment_link_id;
}
