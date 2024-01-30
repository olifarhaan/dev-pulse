import express from "express"

import { verifyToken } from "../middlewares/verifyTokenMiddleware.js"
import {
  createPostController,
  deletePostController,
  getPostController,
  updatePostController,
} from "../controllers/postController.js"
import { verifyAuthor } from "../middlewares/verifyAuthorMiddleware.js"

const router = express.Router()

// router.get("/", getUserController)
router.post("/", verifyToken, verifyAuthor, createPostController)
router.get("/", getPostController)
router.delete(
  "/:postId/:userId",
  verifyToken,
  verifyAuthor,
  deletePostController
)
router.put("/:postId/:userId", verifyToken, verifyAuthor, updatePostController)
// router.put("/:userId", verifyToken, updateUserController)
// router.delete("/:userId", verifyToken, deleteUserController)

export default router
