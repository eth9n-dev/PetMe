import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Login from "./login";
import { gapi } from "gapi-script";
import Logout from "./logout";
import BreedsList from "./BreedsList";
import { Cloudinary } from "@cloudinary/url-gen";
import Input from "./Input";
import "./index.css";

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [userBreeds, setUserBreeds] = useState([]);
  const [user, setUser] = useState(null);
  const [pettedFilter, setPettedFilter] = useState(false);
  const [unpettedFilter, setUnpettedFilter] = useState(false);
  const [clearFilters, setClearFilters] = useState(false);
  const [buttonText, setButtonText] = useState([
    "All",
    "Petted",
    "To Be Petted",
    "Share My List",
  ]);
  const [searchedBreeds, setSearchedBreeds] = useState([]);
  const [searching, setSearching] = useState(false);

  const cld = new Cloudinary({
    cloud: { cloudName: process.env.REACT_APP_CLOUD_NAME },
  });
  const breedRef = useRef([]);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          clientId: clientId,
          scope: "profile email",
        })
        .then(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateUser);
          updateUser(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setButtonText(["ALL", "🖐️", "⛔", "SHARE"]);
      } else {
        setButtonText(["All", "Petted", "To Be Petted", "Share My List"]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filterItems = (searchTerm) => {
    if (searchTerm.length === 0) {
      setSearching(false);
      return;
    } else {
      setSearching(true);
    }

    const matchingIndex = Object.keys(userBreeds).findIndex((breed) =>
      breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingIndex !== -1) {
      breedRef.current[matchingIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const updateUser = (isSignedIn) => {
    if (isSignedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();

      setUser(email);

      axios
        .get(`http://localhost:5000/user/${email}`)
        .then((response) => setUserBreeds(response.data))
        .catch((error) => console.log(error));
    } else {
      setUser(null);
      setUserBreeds([]);
    }
  };

  function pettedFilterToggle() {
    setPettedFilter((prev) => {
      const newPettedFilter = !prev;
      if (newPettedFilter && user) {
        setUnpettedFilter(false);
        setSearching(false);
        setUserBreeds([]);
        axios
          .get(`http://localhost:5000/user/${user}/petted`)
          .then((response) => setUserBreeds(response.data))
          .catch((error) => console.log(error));
      }
    });
  }

  function unpettedFilterToggle() {
    setUnpettedFilter((prev) => {
      const newUnpettedFilter = !prev;
      if (newUnpettedFilter && user) {
        setPettedFilter(false);
        setSearching(false);
        setUserBreeds([]);
        axios
          .get(`http://localhost:5000/user/${user}/unpetted`)
          .then((response) => setUserBreeds(response.data))
          .catch((error) => console.log(error));
      }
    });
  }

  function toggleClearFilters() {
    setClearFilters((prev) => {
      const newClearFilter = !prev;
      if (newClearFilter) {
        setPettedFilter(false);
        setUnpettedFilter(false);
        setSearching(false);
        setUserBreeds([]);
        axios
          .get(`http://localhost:5000/user/${user}`)
          .then((response) => setUserBreeds(response.data))
          .catch((error) => console.log(error));
      }
    });
  }

  function shareList() {
    axios
      .post("http://localhost:5000/share", { userId: user })
      .then((response) => navigator.clipboard.writeText(response.data))
      .catch((error) => console.log(error));

    setButtonText(["All", "Petted", "To Be Petted", "Copied ✔️"]);
  }

  return (
    <>
      <div class="wrapper">
        <div class="NavBar">
          <a class="navLinks" href="/">
            🐾 PetMe
          </a>
          {user ? <Logout /> : <Login />}
        </div>
        <div class="Categories">
          <button class="button-23" onClick={toggleClearFilters}>
            {buttonText[0]}
          </button>
          <button class="button-23" onClick={pettedFilterToggle}>
            {buttonText[1]}
          </button>
          <button class="button-23" onClick={unpettedFilterToggle}>
            {buttonText[2]}
          </button>
          <button class="button-23" onClick={shareList}>
            {buttonText[3]}
          </button>
          <Input onChangeCallback={filterItems} />
        </div>
      </div>

      {user ? (
        <div class="container">
          <div class="MainView">
            <BreedsList
              userBreeds={userBreeds}
              user={user}
              cld={cld}
              dogRefs={breedRef}
            />
          </div>
        </div>
      ) : (
        <div class="Welcome">
          <h1>Sign in to start your collection!</h1> <br /> <Login />
        </div>
      )}
    </>
  );
}

export default App;
