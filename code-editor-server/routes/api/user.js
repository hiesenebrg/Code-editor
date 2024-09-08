const express = require("express");
const router = express.Router();
const passport = require("passport");
const usercontoller = require("../../controllers/user");
router.post("/sign-up", usercontoller.signup);
router.post("/sign-in", usercontoller.createsession);
router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  usercontoller.getUser
);
router.post(
  "/add-fav",
  passport.authenticate("jwt", { session: false }),
  usercontoller.addFavorites
);
router.get(
    "/is-fav/:id",
    passport.authenticate("jwt", { session: false }),
    usercontoller.isFav
  );
router.post(
  "/update-profile",
  passport.authenticate("jwt", { session: false }),
  usercontoller.updateprofile
);
module.exports = router;