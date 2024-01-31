import Post from "../models/postModel.js"
import { UNAUTHORIZED_MESSAGE, roles } from "../utils/constants.js"
import { errorHandler } from "../utils/errors.js"
import generateSlug from "../utils/generateSlug.js"

export const createPostController = async (req, res, next) => {
  console.log("first--------------------------")

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"))
  }
  const slug = generateSlug(req.body.title)
  const newPost = new Post({
    ...req.body,
    slug,
    user: req.user.id,
  })
  try {
    console.log("second----------------------------")

    const savedPost = await newPost.save()
    console.log("thrird----------------------------")
    res
      .status(201)
      .jsonResponse(201, true, "Post created successfully", savedPost)
  } catch (error) {
    next(error)
  }
}

export const getPostController = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex || 0)
    const limit = parseInt(req.query.limit || 9)
    const sortDirection = req.query.order === "asc" ? 1 : -1

    const posts = await Post.find({
      ...(req.query.userId && { user: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalPosts = await Post.countDocuments()
    const today = new Date()
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    )

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).jsonResponse(200, true, "Post fetching successfull", {
      posts,
      totalPosts,
      lastMonthPosts,
    })
  } catch (error) {
    next(error)
  }
}

// Either admin can delete the post or the author of the post
export const deletePostController = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return next(errorHandler(404, "Post not found"))
    }
    if (
      req.user.role === roles.ADMIN ||
      (req.user.role === roles.AUTHOR &&
        req.user.id === req.params.userId &&
        post._id === req.params.postId)
    ) {
      await post.delete()
      res
        .status(200)
        .jsonResponse(200, true, "The post has been deleted successfully")
    } else {
      return next(errorHandler(403, UNAUTHORIZED_MESSAGE))
    }
  } catch (error) {
    next(error)
  }
}

export const updatePostController = async (req, res, next) => {
  try {
    console.log(req.params.postId, "-------------------postid")
    console.log(req.params.userId, "-------------------userid")

    const post = await Post.findById(req.params.postId)
    if (!post) {
      return next(errorHandler(404, "Post not found"))
    }
    if (
      req.user.role === roles.ADMIN ||
      (req.user.role === roles.AUTHOR &&
        req.user.id === req.params.userId &&
        post._id === req.params.postId)
    ) {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
            slug: generateSlug(req.body.title),
          },
        },
        { new: true }
      )
      res
        .status(200)
        .jsonResponse(
          200,
          true,
          "The post has been updated successfully",
          updatePost
        )
    } else {
      return next(errorHandler(403, UNAUTHORIZED_MESSAGE))
    }
  } catch (error) {
    next(error)
  }

  // try {
  //   const updatedPost = await Post.findByIdAndUpdate(
  //     req.params.postId,
  //     {
  //       $set: {
  //         title: req.body.title,
  //         content: req.body.content,
  //         category: req.body.category,
  //         image: req.body.image,
  //       },
  //     },
  //     { new: true }
  //   );
  //   res.status(200).json(updatedPost);
  // } catch (error) {
  //   next(error);
  // }
}
