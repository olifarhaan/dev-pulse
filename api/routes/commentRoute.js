import express from "express"
import {
  createCommentController,
  getPostCommentsController,
  likeCommentController,
  updateCommentController,
  deleteCommentController,
  getCommentsController,
} from "../controllers/commentController.js"
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js"
import { verifyAdmin } from "../middlewares/verifyAdminMiddleware.js"
import { verifyAuthor } from "../middlewares/verifyAuthorMiddleware.js"

const router = express.Router()

router.post("/", verifyToken, createCommentController)
router.get("/", verifyToken, verifyAuthor , getCommentsController)
router.get("/:postId", getPostCommentsController)
router.put("/likeComment/:commentId", verifyToken, likeCommentController)
router.put("/:commentId", verifyToken, updateCommentController)
router.delete("/:commentId", verifyToken, deleteCommentController)

export default router
