import { Star, CheckCircle2, ThumbsUp } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?u=rahul",
    rating: 5,
    date: "12 Oct 2026",
    verified: true,
    content: "Absolutely amazing product! The build quality is premium and it works exactly as described. Delivery was super fast too. Highly recommended!",
    helpful: 24,
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "https://i.pravatar.cc/150?u=priya",
    rating: 4,
    date: "05 Oct 2026",
    verified: true,
    content: "Very satisfied with the purchase. The packaging was good and the item is very beautiful. Deducting one star because the box was slightly dented, but the product is perfect.",
    helpful: 12,
  },
  {
    id: 3,
    name: "Amit Kumar",
    avatar: "https://i.pravatar.cc/150?u=amit",
    rating: 5,
    date: "28 Sep 2026",
    verified: true,
    content: "Worth every penny. I've been using it for a week now and I can definitely see the difference compared to cheaper alternatives. Excellent value for money.",
    helpful: 8,
  }
];

export function ProductReviews() {
  return (
    <div className="mt-16 pt-10 border-t border-border">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <div className="md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-extrabold">4.8</span>
            <div className="space-y-1">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-current" : "fill-current opacity-30"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Based on 128 reviews</p>
            </div>
          </div>
          
          <div className="space-y-2 w-full max-w-[300px]">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3 font-medium text-muted-foreground">{rating}</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full" 
                    style={{ width: `${rating === 5 ? 80 : rating === 4 ? 15 : rating === 3 ? 3 : 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full max-w-[300px] mt-4 py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors">
            Write a Review
          </button>
        </div>
        
        <div className="md:w-2/3 space-y-6 w-full">
          {REVIEWS.map((review) => (
            <div key={review.id} className="p-5 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm flex items-center gap-1.5">
                      {review.name}
                      {review.verified && (
                        <span className="flex items-center text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                        </span>
                      )}
                    </h4>
                    <div className="flex text-yellow-500 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "fill-current opacity-30"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{review.date}</span>
              </div>
              
              <p className="text-sm text-foreground/90 leading-relaxed">
                {review.content}
              </p>
              
              <div className="flex items-center gap-1.5 pt-2">
                <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors border-t border-border mt-4">
            See all 128 reviews
          </button>
        </div>
      </div>
    </div>
  );
}
