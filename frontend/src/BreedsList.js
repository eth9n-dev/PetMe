import DogCard from "./DogCard";

const BreedsList = ({ userBreeds, user, cld, dogRefs }) => {
  return (
    <>
      {userBreeds.length === 0 ? (
        <p>No breed found.</p>
      ) : (
        <>
          {Object.entries(userBreeds).map(([breed, isActive], index) => (
            <DogCard
              key={index}
              breed={breed}
              active={isActive}
              user={user}
              cld={cld}
              ref={(el) => (dogRefs.current[index] = el)}
            />
          ))}
        </>
      )}
    </>
  );
};

export default BreedsList;
