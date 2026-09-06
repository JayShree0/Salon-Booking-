package com.jay.review_service.service;

import com.jay.review_service.model.Review;
import com.jay.review_service.payload.dto.ReviewRequest;
import com.jay.review_service.payload.dto.SalonDTO;
import com.jay.review_service.payload.dto.UserDTO;

import java.util.List;

public interface ReviewService {

    Review createReview(ReviewRequest reviewRequest,
                        UserDTO userDTO,
                        SalonDTO salonDTO);

    List<Review> getReviewsBySalonId(Long salonId);

    Review updateReview(Long reviewId,
                        ReviewRequest reviewRequest,
                        Long userId) throws Exception;

    void deleteReview(Long reviewId,
                      Long userId) throws Exception;

}