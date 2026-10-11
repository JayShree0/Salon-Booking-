package com.jay.notification_service.repository;

import com.jay.notification_service.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserId(Long userId);

    List<Notification> findBySalonIdOrderByCreatedAtDesc(Long salonId);

    List<Notification> findBySalonId(Long salonId);

    long countByUserIdAndIsReadFalse(Long userId);

    boolean existsByUserIdAndBookingIdAndType(Long userId, Long bookingId, String type);

    @Transactional
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsReadByUserId(@Param("userId") Long userId);
}
