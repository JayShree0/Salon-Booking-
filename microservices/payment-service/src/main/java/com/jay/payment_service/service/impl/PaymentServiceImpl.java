package com.jay.payment_service.service.impl;

import com.jay.payment_service.domain.PaymentMethod;
import com.jay.payment_service.domain.PaymentOrderStatus;
import com.jay.payment_service.dto.BookingDTO;
import com.jay.payment_service.dto.UserDTO;
import com.jay.payment_service.model.PaymentOrder;
import com.jay.payment_service.repository.PaymentOrderRepository;
import com.jay.payment_service.response.PaymentLinkResponse;
import com.jay.payment_service.service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${razorpay.api.key}")
    private String razorpayApiKey;

    @Value("${razorpay.api.secret}")
    private String razorpayApiSecret;

    @Override
    public PaymentLinkResponse createOrder(UserDTO user, BookingDTO booking, PaymentMethod paymentMethod) throws Exception {

        Long amount = (long) booking.getTotalPrice(); // Convert to paise for Razorpay
        PaymentOrder order = new PaymentOrder();
        order.setAmount(amount);
        order.setPaymentMethod(paymentMethod);
        order.setBookingId(booking.getId());
        order.setSalonId(booking.getSalonId());
        order.setUserId(user.getId());
        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        PaymentLinkResponse paymentLinkResponse = new PaymentLinkResponse();

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            PaymentLink paymentLink = createRazorpayPaymentLink(
                    user,
                    savedOrder.getAmount(),
                    savedOrder.getId());

            String paymentUrl = paymentLink.get("short_url");
            String paymentUrlId = paymentLink.get("id");

            paymentLinkResponse.setPayment_link_url(paymentUrl);
            paymentLinkResponse.setGetPayment_link_id(paymentUrlId);

            savedOrder.setPaymentLinkId(paymentUrlId);
            paymentOrderRepository.save(savedOrder);

        } else {
            String paymentUrl = createStripePaymentLink(
                    user,
                    savedOrder.getAmount(),
                    savedOrder.getId());

            paymentLinkResponse.setPayment_link_url(paymentUrl);
        }

        return paymentLinkResponse;
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findById(id)
                .orElse(null);

        if (paymentOrder == null) {
            throw new Exception("Payment order not found with id: " + id);
        }

        return paymentOrder;
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentId) {

        return paymentOrderRepository.findByPaymentLinkId(paymentId);
    }

    @Override
    public PaymentLink createRazorpayPaymentLink(UserDTO user, Long amount, Long orderId)  throws Exception {

        Long amountInPaise = amount * 100; // Convert to paise

        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayApiKey, razorpayApiSecret);

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", amountInPaise);
            paymentLinkRequest.put("currency", "INR");

            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullName());
            customer.put("email", user.getEmail());
            paymentLinkRequest.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("email", true);
//            notify.put("sms", true);
            paymentLinkRequest.put("notify", notify);

            paymentLinkRequest.put("reminder_enable", true);
            // replace with actual callback URL and method after testing [ development URL]
            paymentLinkRequest.put("callback_url", "http://localhost.com/3000/payment-success/" + orderId);
            paymentLinkRequest.put("callback_method", "get");
            paymentLinkRequest.put("description", "Payment for booking ID: " + orderId);

            return razorpayClient.paymentLink.create(paymentLinkRequest);

        } catch (RazorpayException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String createStripePaymentLink(UserDTO user, Long amount, Long orderId) throws StripeException {


        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params = SessionCreateParams
                .builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/payment-success/" + orderId)
                .setCancelUrl("http://localhost:3000/payment/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(amount * 100) // Convert to cents
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Salon appointment booking")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);

        return session.getUrl();
    }

    @Override
    public Boolean processPayment(PaymentOrder paymentOrder,
                                  String paymentId, String paymentLinkId) throws Exception {

        if(paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING))
        {
            if(paymentOrder.getPaymentMethod().equals(PaymentMethod.RAZORPAY)){
                RazorpayClient razorpay = new RazorpayClient(razorpayApiKey, razorpayApiSecret);

                Payment payment = razorpay.payments.fetch(paymentId);
                Integer amountPaid = payment.get("amount");
                String status = payment.get("status");
                if(status.equals("captured")){
                    paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                    paymentOrderRepository.save(paymentOrder);
                    return true;
                }
                return false;
            }
            else{
                // For Stripe, you would typically verify the payment using webhooks.
                // This is a placeholder for processing Stripe payments.
                // You would need to implement webhook handling to update the payment status based on Stripe's events.

                // For now, we will assume the payment is successful for demonstration purposes.
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
        }
        return null;
    }

}
