import Comment from "../models/commentModel.js"
import { roles } from "../utils/constants.js"
import { errorHandler } from "../utils/errors.js"

export const createCommentController = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      )
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    })
    await newComment.save()

    console.log(newComment, "----------------")

    res
      .status(201)
      .jsonResponse(201, true, "Comment added successfully", newComment)
  } catch (error) {
    next(error)
  }
}

export const getPostCommentsController = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    })
    res
      .status(200)
      .jsonResponse(200, true, "Comments retrieved successfully", comments)
  } catch (error) {
    next(error)
  }
}

export const likeCommentController = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "Comment not found"))
    }
    // Check if user has already liked the post
    const userIndex = comment.likes.indexOf(req.user.id)
    if (userIndex === -1) {
      comment.numberOfLikes += 1
      comment.likes.push(req.user.id)
    } else {
      comment.numberOfLikes -= 1
      comment.likes.splice(userIndex, 1)
    }
    console.log(comment, "----------comment")

    await comment.save()
    res
      .status(200)
      .jsonResponse(200, true, "Comment updation successfull", comment)
  } catch (error) {
    next(error)
  }
}

export const updateCommentController = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "Comment not found"))
    }
    if (comment.userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to edit this comment"))
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    )
    res
      .status(200)
      .jsonResponse(200, true, "Comment edited successfully", editedComment)
  } catch (error) {
    next(error)
  }
}

export const deleteCommentController = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "Comment not found"))
    }
    if (comment.userId !== req.user.id && req.user.role !== roles.ADMIN) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      )
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json("Comment has been deleted")
  } catch (error) {
    next(error)
  }
}

export const getCommentsController = async (req, res, next) => {
  console.log("inside comment")

  if (!(req.user.role === roles.ADMIN || req.user.role === roles.AUTHOR))
    return next(errorHandler(403, "You are not allowed to get all comments"))
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === "asc" ? 1 : -1
    const comments = await Comment.find({
      ...(req.query.userId &&
        req.user.role === roles.AUTHOR && { user: req.query.userId }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
    const totalComments = await Comment.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })
    console.log({ comments, totalComments, lastMonthComments })

    res.status(200).jsonResponse(200, true, "Comments retrieved successfully", {
      comments,
      totalComments,
      lastMonthComments,
    })
  } catch (error) {
    next(error)
  }
}
