import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config";
import "./ServiceProvider.css";

const ServiceProvider = () => {
  const [providers, setProviders] = useState([]);
  const [providerReviews, setProviderReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/service-providers`);
        if (res.data.success) {
          const providerList = res.data.providers;
          setProviders(providerList);

          const reviewsByProvider = {};
          await Promise.all(
            providerList.map(async (provider) => {
              try {
                const reviewRes = await axios.get(
                  `${API_URL}/api/reviews/provider/${provider._id}`,
                );
                if (reviewRes.data.success) {
                  reviewsByProvider[provider._id] = {
                    reviews: reviewRes.data.reviews,
                    averageRating: reviewRes.data.averageRating,
                    count: reviewRes.data.count,
                  };
                } else {
                  reviewsByProvider[provider._id] = {
                    reviews: [],
                    averageRating: 0,
                    count: 0,
                  };
                }
              } catch {
                reviewsByProvider[provider._id] = {
                  reviews: [],
                  averageRating: 0,
                  count: 0,
                };
              }
            }),
          );
          setProviderReviews(reviewsByProvider);
        }
      } catch (err) {
        console.error("Failed to fetch service providers:", err);
        setError("Failed to load service providers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, []);

  if (loading) {
    return (
      <div className="service-provider-page">
        <p className="loading-text">Loading service providers...</p>
      </div>
    );
  }

  return (
    <div className="service-provider-page">
      <div className="service-provider-header">
        <h1>Our Service Providers</h1>
        <p>Meet our team of professional service providers</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {providers.length === 0 ? (
        <div className="no-providers">
          <p>No service providers available at the moment.</p>
        </div>
      ) : (
        <div className="providers-grid">
          {providers.map((provider) => {
            const reviewData = providerReviews[provider._id] || {
              reviews: [],
              averageRating: 0,
              count: 0,
            };

            return (
              <div className="provider-card" key={provider._id}>
                <div className="provider-info">
                  <h3 className="provider-name">{provider.name}</h3>
                  <div className="provider-details">
                    <p>
                      <strong>Email:</strong> {provider.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {provider.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {provider.address}
                    </p>
                  </div>

                  <div className="provider-reviews-section">
                    <h4>Customer Reviews</h4>
                    <p className="reviews-avg">
                      Average: {reviewData.averageRating || 0} ★ (
                      {reviewData.count} review
                      {reviewData.count !== 1 ? "s" : ""})
                    </p>
                    {reviewData.reviews.length === 0 ? (
                      <p className="no-reviews-inline">No reviews yet.</p>
                    ) : (
                      <div className="reviews-inline-list">
                        {reviewData.reviews.map((review) => (
                          <div className="review-inline-card" key={review._id}>
                            <strong>{review.userId?.name || "User"}</strong>
                            <span>{"★".repeat(review.rating)}</span>
                            <p>{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceProvider;
