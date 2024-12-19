import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

function Share() {
  let { uuid } = useParams();

  const [userBreeds, setUserBreeds] = useState({});
  const [completeItems, setCompleteItems] = useState([]);
  const [incompleteItems, setIncompleteItems] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);
  const [rank, setRank] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Fetch the data
    axios
      .get(`http://localhost:5000/${uuid}`)
      .then((response) => {
        setUserBreeds(response.data); // Set the received data into state
        setDataReceived(true); // Indicate that data has been received
      })
      .catch((error) => console.log(error));
  }, [uuid]);

  // Split data into two lists based on true/false values
  useEffect(() => {
    if (dataReceived) {
      const tempCompleteItems = [];
      const tempIncompleteItems = [];

      for (let breed in userBreeds) {
        if (userBreeds[breed] === true) {
          tempCompleteItems.push(breed);
        } else {
          tempIncompleteItems.push(breed);
        }
      }

      // Update the state with the new lists
      setCompleteItems(tempCompleteItems);
      setIncompleteItems(tempIncompleteItems);

      setRank(getRank(tempCompleteItems.length));
      setDescription(getDescription(tempCompleteItems.length));
    }
  }, [userBreeds, dataReceived]); // Runs when data is received

  const progress =
    (completeItems.length / (completeItems.length + incompleteItems.length)) *
    100;

  function getRank(numCollected) {
    const totalItems = 195; // Total number of items in the collection

    // Calculate the percentage of items collected
    const percentageCollected = (numCollected / totalItems) * 100;

    // Determine the rank based on the number of items collected
    if (percentageCollected >= 0 && percentageCollected <= 10) {
      return "Novice Collector";
    } else if (percentageCollected > 10 && percentageCollected <= 25) {
      return "Apprentice Collector";
    } else if (percentageCollected > 25 && percentageCollected <= 50) {
      return "Adept Collector";
    } else if (percentageCollected > 50 && percentageCollected <= 75) {
      return "Master Collector";
    } else if (percentageCollected > 75 && percentageCollected <= 90) {
      return "Grand Collector";
    } else if (percentageCollected > 90 && percentageCollected < 100) {
      return "Legendary Collector";
    } else if (percentageCollected === 100) {
      return "Ultimate Collector";
    }
  }

  function getDescription(numCollected) {
    const totalItems = 195; // Total number of dogs in the collection

    // Calculate the percentage of dogs collected (petted)
    const percentageCollected = (numCollected / totalItems) * 100;

    // Return the description based on the rank
    if (percentageCollected >= 0 && percentageCollected <= 10) {
      return "You're just starting out on your journey to meet and pet dogs. You're discovering new breeds and beginning to build your dog-loving collection!";
    } else if (percentageCollected > 10 && percentageCollected <= 25) {
      return "You've met a few dogs and gained some experience. Your dog collection is growing, and you're starting to understand the unique personalities of different breeds!";
    } else if (percentageCollected > 25 && percentageCollected <= 50) {
      return "You've pet a good number of dogs, and your collection is coming along nicely. You're getting to know the distinct characteristics of each breed, and your bond with dogs is becoming stronger!";
    } else if (percentageCollected > 50 && percentageCollected <= 75) {
      return "You're a seasoned dog lover! Your collection is impressive, and you've spent quality time with a variety of breeds. You know how to care for and appreciate each one.";
    } else if (percentageCollected > 75 && percentageCollected <= 90) {
      return "You're now a dog expert. You've met many breeds, and your collection is diverse and remarkable. Your dog-loving heart is a force to be reckoned with!";
    } else if (percentageCollected > 90 && percentageCollected < 100) {
      return "Only a few people have accomplished what you have. You've pet nearly every dog breed out there, and your knowledge and affection for dogs are legendary!";
    } else if (percentageCollected === 100) {
      return "Congratulations! You've reached the peak of dog-loving. You've met and petted every dog in the collection. You are the ultimate dog lover!";
    }
  }

  return (
    <>
      <div class="NavBarShare">
        <a class="navLinks" href="http://localhost:3000">
          🐾 PetMe
        </a>
      </div>
      <div id="app-container">
        <h1>Name's Collection</h1>
        <h4>
          {completeItems.length} /{" "}
          {completeItems.length + incompleteItems.length}
        </h4>
        <h4>{rank}</h4>
        <h6>{description}</h6>
        <div id="progress-bar-container">
          <div id="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div id="lists-container">
          <div className="list-column">
            <h2>Petted</h2>
            <ul>
              {completeItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="list-column">
            <h2>To Be Pet</h2>
            <ul>
              {incompleteItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Share;
