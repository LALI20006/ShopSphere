import React, { useState, useEffect } from "react";
import { Star, CheckCircle, ThumbsUp, MessageSquare, X } from "lucide-react";
import { Review, Product } from "../../types";
import { reviewApi } from "../../services/api";
import { RatingStars } from "../common/RatingStars";
import { useAuthStore } from "../../store/authStore";

interface ReviewSectionProps {
  product: Product;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ product }) => {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const res = await reviewApi.getProductReviews(product.id);
      setReviews(res.reviews || []);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate rating breakdown distribution
  const totalReviews = Math.max(reviews.length, 1);
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const rounded = Math.round(r.rating);
    if (distribution[rounded] !== undefined) {
      distribution[rounded]++;
    }
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Please sign in to submit a review.");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("Please write a few words about your experience.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await reviewApi.submitReview({
        productId: product.id,
        rating,
        title: title.trim() || "Verified Experience",
        comment: comment.trim(),
      });
      setReviews([res.review, ...reviews]);
      setSuccessMsg("Thank you! Your review has been published.");
      setTitle("");
      setComment("");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-10 my-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Summary & Rating Breakdown */}
        <div className="lg:w-80 shrink-0">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Reviews</h3>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-extrabold text-slate-900">{product.rating.toFixed(1)}</span>
            <div className="space-y-1">
              <RatingStars rating={product.rating} size="md" showCount={false} />
              <span className="text-xs text-slate-500 block">
                Based on {reviews.length.toLocaleString("en-IN")} global ratings
              </span>
            </div>
          </div>

          {/* 5 to 1 star percentage bars */}
          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || (stars === 5 ? Math.round(product.reviewsCount * 0.7) : 0);
              const pct = reviews.length > 0
                ? Math.round((count / totalReviews) * 100)
                : stars === 5 ? 75 : stars === 4 ? 18 : 3;

              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-medium text-slate-600 shrink-0">
                    {stars} star
                  </span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400 font-medium shrink-0">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Write a review action card */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Review this product</h4>
            <p className="text-xs text-slate-500 mb-3">
              Share your thoughts and feedback with other customers.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs rounded-xl transition-all shadow-subtle"
            >
              Write a Product Review
            </button>
          </div>
        </div>

        {/* Right Column: Customer Reviews List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-base">
              Customer Feedback ({reviews.length})
            </h4>
            <span className="text-xs text-slate-500">Sorted by Most Recent</span>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-sm">No written customer reviews yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Be the first to review this product and help others!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {rev.userName.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <RatingStars rating={rev.rating} size="sm" showCount={false} />
                    <span className="font-bold text-slate-900 text-xs">{rev.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span>Reviewed on {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {rev.isVerifiedPurchase && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Review</h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-1">{product.name}</p>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-sm font-semibold">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* Overall Rating Star Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform active:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            (hoverRating || rating) >= star
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-700">
                      {hoverRating || rating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    placeholder="What's most important to know?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Written Review */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Written Review
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What did you like or dislike? How was the build quality and performance?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
