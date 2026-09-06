package com.jay.review_service.repository;

import com.jay.review_service.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findBySalonId(Long salonId);
    List<Review> findByUserId(Long userId);
}
