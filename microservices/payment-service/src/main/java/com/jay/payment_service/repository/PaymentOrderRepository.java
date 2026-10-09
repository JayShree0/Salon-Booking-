package com.jay.payment_service.repository;

import com.jay.payment_service.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    PaymentOrder findByPaymentLinkId(String paymentLinkId);

    List<PaymentOrder> findAllBySalonId(Long salonId);
}
