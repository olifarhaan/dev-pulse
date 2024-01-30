import mongoose from "mongoose"
import { category } from "../utils/constants.js"

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    category: {
      type: String,
      enum: Object.values(category),
      default: category.OTHER,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

//Adding uniqueness at MongoDB level
postSchema.index({ slug: 1 }, { unique: true })

const Post = mongoose.model("Post", postSchema)

export default Post
