import { useEffect, useState } from "react";

const Ratings = ({defaultRating, isEditable,  onRatingChange=()=>{} }) => {

  const [selectedRating, setSelectedRating] = useState(defaultRating)

 useEffect(() => {
    setSelectedRating(defaultRating);
  }, [defaultRating]);

  useEffect(() => {
    onRatingChange(selectedRating);
  }, [selectedRating]);

  return (
       <div className={`rating ${!isEditable ? "pointer-events-none" : ""}`}>
      {[1, 2, 3, 4, 5].map((rating) => {
        return (
          <input
            key={rating}
              type="radio" 
              name="rating"
              value={rating}
              onChange ={() => setSelectedRating(rating)}
              checked={selectedRating === rating}
              className="mask mask-star-2 bg-orange-400" 
          />
        );
      })}
    </div>
  )
}

export default Ratings