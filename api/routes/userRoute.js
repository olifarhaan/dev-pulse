import express from "express"
import {
  deleteUserController,
  getUsersController,
  updateUserController,
  getUserController,
} from "../controllers/userController.js"
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js"
import { verifyAdmin } from "../middlewares/verifyAdminMiddleware.js"

const router = express.Router()

router.get("/", verifyToken, verifyAdmin, getUsersController)
router.get("/:userId", getUserController)
router.put("/:userId", verifyToken, updateUserController)
router.delete("/:userId", verifyToken, deleteUserController)

export default router
