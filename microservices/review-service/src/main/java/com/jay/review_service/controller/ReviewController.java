package com.jay.review_service.controller;

import com.jay.review_service.model.Review;
import com.jay.review_service.payload.dto.ApiResponse;
import com.jay.review_service.payload.dto.ReviewRequest;
import com.jay.review_service.payload.dto.SalonDTO;
import com.jay.review_service.payload.dto.UserDTO;
import com.jay.review_service.service.ReviewService;
import com.jay.review_service.service.client.SalonFeignClient;
import com.jay.review_service.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserFeignClient userFeignClient;
    private final SalonFeignClient salonFeignClient;

    @PostMapping("/salon/{salonId}")
    public ResponseEntity<Review> createReview(
            @PathVariable Long salonId,
            @RequestBody ReviewRequest reviewRequest,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // Makes an inter-service call to USER-SERVICE via Feign to retrieve the authenticated user's details using the provided JWT
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        // Makes an inter-service call to SALON-SERVICE via Feign to retrieve the salon's details using the provided salonId
        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

        // Delegates the actual creation and persistence of the review to the service layer, passing the payload, user, and salon data
        Review review = reviewService.createReview(reviewRequest, userDTO, salonDTO);

        // Returns the saved Review entity back to the client with an HTTP 200 OK status
        return ResponseEntity.ok(review);


    }


    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Review>> getReviewsBySalonId(
            @PathVariable Long salonId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        // Makes an inter-service call to SALON-SERVICE via Feign to verify the salon exists before fetching reviews
        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

        // Retrieves all reviews associated with the specified salonId from the service layer
        List<Review> reviews = reviewService.getReviewsBySalonId(salonId);

        // Returns the list of reviews back to the client with an HTTP 200 OK status
        return ResponseEntity.ok(reviews);

    }


    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest reviewRequest,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        // Makes an inter-service call to USER-SERVICE via Feign to authenticate the user attempting the update
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();


        // Updates the existing review details via the service layer, validating ownership using the extracted userId
        Review reviews = reviewService.updateReview(
                reviewId,
                reviewRequest,
                userDTO.getId()
        );

        // Returns the updated Review entity back to the client with an HTTP 200 OK status
        return ResponseEntity.ok(reviews);

    }


    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        // Makes an inter-service call to USER-SERVICE via Feign to authenticate the user attempting the deletion
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        // Delegates review deletion to the service layer, ensuring only the review owner can delete it
        reviewService.deleteReview(
                reviewId,
                userDTO.getId()
        );
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Review deleted successfully");
        // Returns the confirmation ApiResponse message back to the client with an HTTP 200 OK status
        return ResponseEntity.ok(apiResponse);


    }
}