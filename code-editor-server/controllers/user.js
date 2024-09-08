const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const AVATAR_PATH = path.join("/uploads/users/avatar");

const prisma = new PrismaClient({ log: ["query"] });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../..", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});
const upload = multer({ storage: storage });

module.exports.signup = async function (req, res) {
  try {
    console.log(req.body);
    let user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User already existed! Please Login",
        data: {
          user: user,
        },
      });
    } else {
      console.log(req.body);
      user = await prisma.user.create({
        data: req.body,
      });
      console.log(user);
      return res.status(200).json({
        success: true,
        message: "Sign up Successful, Please login",
      });
    }
  } catch (error) {
    console.log(`There is an error while signup ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.createsession = async function (req, res) {
  try {
    let user;
    user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.nickname,
          avatar: req.body.picture,
        },
      });
      //   console.log(user);
    }
    return res.status(200).json({
      success: true,
      message: "Sign in Successful, Here is your token please keep it safe!",
      data: {
        token: jwt.sign(
          { id: user.id, email: user.email },
          process.env.HASH_KEY,
          {
            expiresIn: "3d",
          }
        ),
        user: {
          username: user.name,
          email: user.email,
          id: user.id,
          admin: user.admin,
        },
      },
    });
  } catch (error) {
    console.log("********", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.updateprofile = async function (req, res) {
  try {
    // console.log("req", req.user);
    let user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Assuming you have a multer middleware for handling file uploads

    upload.single("avatar")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A multer error occurred when uploading
        console.log("Multer error:", err);
        return res.status(500).json({
          success: false,
          message: "File upload error",
        });
      } else if (err) {
        // An unknown error occurred
        console.log("Unknown error:", err);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }

      // File upload successful, continue with saving course data

      const avatarPath = req.file
        ? path.join(AVATAR_PATH, req.file.filename)
        : undefined;
      const UpdateUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password, // Save the avatar path if uploaded
          avatar: avatarPath ? avatarPath : undefined,
        },
      });

      return res.status(200).json({
        success: true,
        message: "User Updated",
        course: UpdateUser,
      });
    });
  } catch (error) {
    console.log("********", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getUser = async function (req, res) {
  try {
    // console.log("coming inside funs", req.body, req.user);
    const userId = req.user.id; // Assuming req.user contains user information

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        password: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User Details",
      user: user,
    });
  } catch (error) {
    console.log("********", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.isFav = async function (req, res) {
  try {
    const isFavorite = await prisma.movie.findUnique({
      where: {
        movieID: req.params.id,
      },
      select: {
        id: true,
        favorites: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!isFavorite) {
      return res.status(200).json({
        success: false,
        message: "Movie is not Favorited",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Movie already  Favorited",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Interval server error",
    });
  }
};
module.exports.addFavorites = async function (req, res) {
  console.log("inside", req.body.movieID, typeof req.body.movieID);
  try {
    let isFavorite = await prisma.movie.findUnique({
      where: {
        movieID: req.body.movieID,
      },
    });
    console.log("");
    if (!isFavorite) {
      let favorite = await prisma.movie.create({
        data: {
          movieID: req.body.movieID,
        },
      });
      console.log("isFavorite", isFavorite, "favorite", favorite);
      let connected = await prisma.movieToVideo.create({
        data: {
          MovieId: favorite.id,
          userId: req.user.id,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Successfully Added to Favorite List",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Movie already  Favorited",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports.getFavorites = async function (req, res) {
  try {
  } catch (error) {
    console.log("error", error);
  }
};