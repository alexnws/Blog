import UserModel from "../db/models/User.js"
import CommentModel from "../db/models/Comment.js"

const commentRoutes = ({ app }) => {
  app.post("/comments", async (req, res) => {
    const {
      body: { content, user_id, postId, publicationDate },
    } = req

    const existingUser = await UserModel.query().findById(user_id)

    if (!existingUser) {
      res.send({ error: "no users" })

      return
    }

    await CommentModel.query().insert({
      content,
      user_id: user_id,
      post_id: postId,
      publicationDate,
    })

    res.send({ status: "comment published" })
  })

  app.delete("/comments/:id", async (req, res) => {
    const {
      params: { id },
    } = req
    await CommentModel.query().deleteById(id)

    res.send({ status: "COMMENT DELETED" })
  })

  app.get("/comments/:commentId", async (req, res) => {
    const {
      params: { commentId },
    } = req

    const comment = await CommentModel.query()
      .findById(commentId)
      .select("comments.*", "users.displayName as author", "posts.user_id")
      .leftJoinRelated("[users, posts]")

    if (!comment) {
      res.status(404).send({ error: "Comment not found" })

      return
    }

    res.status(200).send(comment)
  })

  app.put("/comments/:commentId", async (req, res) => {
    const {
      params: { commentId },
      body: { content },
    } = req

    const existingComment = await CommentModel.query().findById(commentId)

    if (!existingComment) {
      res.status(404).send({ error: "comment not found" })

      return
    }

    await CommentModel.query().findById(commentId).patch({ content })
    res.send({ status: "OK" })
  })
}

export default commentRoutes
