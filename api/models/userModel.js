import mongoose from "mongoose"

const validateRole = (value) => {
  const validRoles = ["user", "author", "admin"]
  if (!validRoles.includes(value)) {
    throw new Error("Invalid role value")
  }
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    role: {
      type: String,
      validate: {
        validator: validateRole,
        message: "Invalid role value",
      },
      default: "user",
    },
  },
  {
    timestamps: true,
  }
)

// For ensuring the integrity of the database
userSchema.pre("remove", async function (next) {
  try {
    // Delete all posts where userId matches the current user's _id
    await Post.deleteMany({ user: this._id })
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model("User", userSchema)

export default User
