import express from "express"
import {
  deleteUserController,
  getUsersController,
  updateUserController,
} from "../controllers/userController.js"
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js"
import { verifyAdmin } from "../middlewares/verifyAdminMiddleware.js"

const router = express.Router()

router.get("/", verifyToken, verifyAdmin, getUsersController)
router.put("/:userId", verifyToken, updateUserController)
router.delete("/:userId", verifyToken, deleteUserController)

export default router
