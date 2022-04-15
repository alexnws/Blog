import UserModel from "../db/models/User.js"

const userRoutes = ({ app }) => {
  app.delete("/users/:id", async (req, res) => {
    const {
      params: { id },
    } = req
    await UserModel.query().deleteById(id)

    res.send({ status: "POST DELETED" })
  })

  app.get("/users/:userId", async (req, res) => {
    const {
      params: { userId },
    } = req

    const userAndRole = await UserModel.query()
      .findById(userId)
      .select(
        "users.id",
        "users.displayName",
        "users.email",
        "users.role_id",
        "roles.name as role"
      )
      .joinRelated("roles")

    if (!userAndRole) {
      res.status(404).send({ error: "User not found" })

      return
    }

    res.status(200).send(userAndRole)
  })

  app.get("/users", async (req, res) => {
    const usersAndRoles = await UserModel.query()
      .select(
        "users.id",
        "users.displayName",
        "users.email",
        "users.role_id",
        "roles.name as role"
      )
      .joinRelated("roles")
      .orderBy("role_id", "desc")

    res.status(200).send(usersAndRoles)
  })

  app.put("/users", async (req, res) => {
    const {
      body: { displayName, id },
    } = req
    const existingPost = await UserModel.query().findById(id)

    if (!existingPost) {
      res.status(404).send({ error: "comment not found" })

      return
    }

    await UserModel.query().findById(id).patch({ displayName })
    res.send({ status: "OK" })
  })

  app.put("/users/:id", async (req, res) => {
    const {
      params: { id },
      body: { role },
    } = req

    const user = await UserModel.query().findById(id)

    if (!user) {
      res.status(404).send({ error: "User not found" })

      return
    }

    await UserModel.query().updateAndFetchById(id, {
      role_id: role,
    })

    res.status(200).send({ status: "User role changed" })
  })
}

export default userRoutes
