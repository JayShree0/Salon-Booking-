import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import ReviewCard from './ReviewCard';
import { Divider } from '@mui/material';
import RatingCard from './RatingCard';

const Review = () => {
    const { id: salonId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReviews = async () => {
        // The reviews API needs a signed in user, so we ask for the
        // profile only when a token is saved.
        if (!localStorage.getItem("jwt")) {
            setUserId(null);
            setError("Please sign in to read the reviews of this salon.");
            setLoading(false);
            return;
        }

        try {
            const [reviewResponse, userResponse] = await Promise.all([
                api.get(`/api/reviews/salon/${salonId}`),
                api.get("/api/users/profile"),
            ]);
            setReviews(reviewResponse.data || []);
            setUserId(userResponse.data.id);
            setError("");
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [salonId]);

    const updateReview = (review) => {
        setReviews((current) => current.map((item) => item.id === review.id ? review : item));
    };

    const deleteReview = (reviewId) => {
        setReviews((current) => current.filter((item) => item.id !== reviewId));
    };

  return (
    <div className="pt-10 flex flex-col lg:flex-row gap-20">
        <section className="w-full md:w-1/2 lg:w-[40%] space-y-2">
            <h1 className="font-semibold text-lg pb-4">
                Review & Rating
            </h1>
                        <RatingCard reviews={reviews}/>
        </section>
        <section className="w-full md:w-1/2 lg:w-[60%]">
                        {error && <p role="alert" className="py-3 text-red-700">{error}</p>}
                        {loading && <p className="py-3 text-gray-600">Loading reviews...</p>}
            <div className="mt-10">
                <div className="space-y-5">
                                        {!loading && !error && reviews.length === 0 && <p className="py-5 text-gray-600">No reviews yet. You can be the first to leave one.</p>}
                                        {reviews.map((review) =>
                                        <div key={review.id} className="space-y-4">
                                                <ReviewCard review={review} currentUserId={userId} onUpdate={updateReview} onDelete={deleteReview}/>
                        <Divider/>
                    </div>
                     ) }

                </div>
            </div>
        </section>
    </div>
  )
}

export default Review
