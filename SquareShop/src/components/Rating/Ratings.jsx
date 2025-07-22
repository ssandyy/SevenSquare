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
              <div key={rating}>
            {rating <= selectedRating ? (
              <input
                onClick={() => setSelectedRating(rating)}
                className={`mask mask-star-2 bg-orange-400 `}
              />
            ) : (
              <input
                onClick={() => setSelectedRating(rating)}
                className={`mask mask-star-2 bg-orange-400/20 `}
              />
            )}
          </div>
              );
        })}
     </div>
  )
}

export default Ratings