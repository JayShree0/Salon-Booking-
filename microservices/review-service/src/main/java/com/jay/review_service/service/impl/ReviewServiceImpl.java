package com.jay.review_service.service.impl;

import com.jay.review_service.model.Review;
import com.jay.review_service.payload.dto.ReviewRequest;
import com.jay.review_service.payload.dto.SalonDTO;
import com.jay.review_service.payload.dto.UserDTO;
import com.jay.review_service.repository.ReviewRepository;
import com.jay.review_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public Review createReview(ReviewRequest reviewRequest, UserDTO userDTO, SalonDTO salonDTO) {

        Review review = new Review();
        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());
        review.setUserId(userDTO.getId());
        review.setSalonId(salonDTO.getId());

        return reviewRepository.save(review);
    }


    @Override
    public List<Review> getReviewsBySalonId(Long salonId) {
        return reviewRepository.findBySalonId(salonId);
    }

    private Review getReviewById(Long reviewId) throws Exception{
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not exists ...."));
    }

    @Override
    public Review updateReview(Long reviewId, ReviewRequest reviewRequest, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if(!review.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this review");
        }
        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());
        return reviewRepository.save(review);

    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {

        Review review = getReviewById(reviewId);
        if(!review.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this review");
        }
        reviewRepository.delete(review);

    }
}
