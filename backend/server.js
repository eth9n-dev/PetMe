const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const breeds = require("./breeds.json");
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Returns every registered breed
app.get("/breeds", (req, res) => res.send(breeds));

// Registers/Retrieves user data based on email param
app.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let user = await User.findOne({ email }, "tobecollected");

    if (!user) {
      user = new User({
        email: email,
        tobecollected: breeds,
        uuid: crypto.randomUUID(),
      });
      await user.save();
      console.log("Saved new user to database: " + email);
    }

    console.log("Retrieved user data for " + email);
    res.json(user.tobecollected);
  } catch (error) {
    console.log(error);
  }
});

// Retrieves user's "petted" dogs
app.get("/user/:email/petted", async (req, res) => {
  try {
    const { email } = req.params;
    let user = await User.findOne({ email }, "tobecollected");

    if (!user || user === "null") {
      console.log(
        "User " + email + " needs to be registered before accessing this list."
      );
    } else {
      const pettedBreeds = Object.entries(user.tobecollected)
        .filter(([_, value]) => value === true)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      res.json(pettedBreeds);
    }
  } catch {
    console.log(error);
  }
});

// Retrieves user's "unpetted" dogs
app.get("/user/:email/unpetted", async (req, res) => {
  try {
    const { email } = req.params;
    let user = await User.findOne({ email }, "tobecollected");

    if (!user || user === "null") {
      console.log(
        "User " + email + " needs to be registered before accessing this list."
      );
    } else {
      const unpettedBreeds = Object.entries(user.tobecollected)
        .filter(([_, value]) => value === false)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      res.json(unpettedBreeds);
    }
  } catch {
    console.log(error);
  }
});

// UUID endpoint for user list sharing
app.get("/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    let user = await User.findOne({ uuid: uuid });

    if (!user) {
      res.status(400).send({ message: "User was not found." });
    }
    res.json(user.tobecollected);
  } catch (error) {
    console.log(error);
  }
});

// Toggling Selection Endpoint (requires the breed and userID trying to toggle it)
app.post("/toggleCollected", async (req, res) => {
  const { userId, breed } = req.body;

  console.log("Received: " + userId + " " + breed);
  // Validate
  if (!userId || !breed) {
    return res.status(400).send({ message: "UserID and Breed are required." });
  }

  const user = await User.findOne({ email: userId });

  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  const currentValue = user.tobecollected[breed.breed];
  const newValue = !currentValue;

  try {
    await User.updateOne(
      { email: userId },
      { $set: { [`tobecollected.${breed.breed}`]: newValue } }
    );
    res.status(200).send({ message: "Breed toggle was successful." });
  } catch (error) {
    console.error("Failed to toggle breed:", error);
    res.status(500).send({ message: "Failed to toggled breed." });
  }
});

// User sharing list
app.post("/share", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "User is required." });
  }

  const user = await User.findOne({ email: userId });

  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  const uniqueIdentifier = user.uuid;
  res.json("http://localhost:3000/" + uniqueIdentifier);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
