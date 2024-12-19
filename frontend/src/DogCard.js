import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

const DogCard = forwardRef(({ breed, active, user, cld }, ref) => {
  const [isActive, setActive] = useState(active);
  const [isShaking, setShaking] = useState(false);

  const img = cld
    .image(breed)
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(300).height(300));

  const handleToggle = async () => {
    setActive(!isActive);

    try {
      await axios.post("http://localhost:5000/toggleCollected", {
        userId: user,
        breed: { breed },
      });
    } catch (error) {
      setActive(!isActive);
      console.error("Toggle failed: ", error);
    }
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const bgColor = isActive ? "green" : "red";

  return (
    <button
      ref={ref}
      onClick={handleToggle}
      className={isShaking ? "shake" : ""}
      style={{
        backgroundColor: bgColor,
        margin: "5px",
        borderRadius: "5px",
        padding: "1px",
        position: "relative",
        zIndex: "0",
        display: "inline-block",
      }}
    >
      <div class="card">
        <div class="card-inner">
          <div class="card-front">
            <AdvancedImage cldImg={img} />
            <h3>
              <b style={{ color: "black" }}>{breed}</b>
            </h3>
          </div>
          <div class="card-back">
            <h1>{breed}</h1>
            <p>
              <b>Life Span:</b> 12 - 15 years
            </p>
            <p>
              <b>Description:</b> The American Foxhound is a breed of dog known
              for its hunting abilities, particularly in chasing foxes. It is an
              American breed, originally developed in the 18th century by
              crossing English Foxhounds with various other breeds to create a
              more agile and versatile hunting dog. This breed is known for
              being friendly, loyal, and independent. American Foxhounds are
              highly energetic, intelligent, and require regular exercise to
              stay healthy and happy. They have a strong prey drive, so they
              excel in tracking and trailing, making them perfect hunting
              companions.
            </p>
          </div>
        </div>
      </div>
    </button>
  );
});

export default DogCard;
