import PostModel from "../db/models/Post.js"
import CommentModel from "../db/models/Comment.js"

const postRoutes = ({ app }) => {
  app.post("/posts", async (req, res) => {
    const {
      body: { content, user_id, title, publicationDate },
    } = req

    await PostModel.query().insert({
      title,
      content,
      user_id,
      publicationDate,
    })

    res.send({ status: "comment published" })
  })

  app.delete("/posts/:id", async (req, res) => {
    const {
      params: { id },
    } = req
    await PostModel.query().deleteById(id)

    res.send({ status: "POST DELETED" })
  })

  app.get("/posts/:post_id/comments", async (req, res) => {
    const {
      params: { post_id },
    } = req

    const posts = await PostModel.query().findById(post_id)

    if (!posts) {
      res.status(404).send({ error: "Post not found" })

      return
    }

    const comments = await posts
      .$relatedQuery("comments")
      .select("comments.*", "users.displayName")
      .leftJoinRelated("users")
      .orderBy("createdAt")

    res.status(200).send(comments)
  })

  app.get("/posts/:id/comments/:commentId", async (req, res) => {
    const {
      params: { commentId },
    } = req

    const comment = await CommentModel.query()
      .findById(commentId)
      .select("comments.*", "users.displayName", "posts.user_id as post_id")
      .leftJoinRelated("[users, posts]")

    if (!comment) {
      res.status(404).send({ error: "Comment not found" })

      return
    }

    res.status(200).send(comment)
  })

  app.get("/posts/:id", async (req, res) => {
    const {
      params: { id },
    } = req

    const post = await PostModel.query()
      .findById(id)
      .select("posts.*", "users.displayName")
      .leftJoinRelated("users")

    if (!post) {
      res.status(404).send({ error: "no post " })

      return
    }

    res.status(200).send(post)
  })

  app.get("/posts", async (req, res) => {
    const posts = await PostModel.query()
      .select("posts.*", "users.displayName")
      .leftJoinRelated("users")
      .orderBy("createdAt", "desc")

    res.status(200).send(posts)
  })

  app.get("/posts/user/:id", async (req, res) => {
    const {
      params: { id },
    } = req
    await PostModel.query().where({ user_id: id })

    res.send({ status: "get all post " })
  })

  app.put("/posts/:id", async (req, res) => {
    const {
      params: { id },
      body: { title, content },
    } = req

    const modified = await PostModel.query().updateAndFetchById(id, {
      title,
      content,
    })

    if (!modified) {
      res.status(404).send({ error: "No Post found" })

      return
    }

    await PostModel.query().findById(id).patch({ title, content })
    res.send({ status: "OK" })
  })
}
export default postRoutes
