import UserModel from "../db/models/User.js"
import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"

const sessionRoutes = ({ app }) => {
  app.post("/sign-up", async (req, res) => {
    const {
      body: { displayName, email, password },
    } = req

    const existingUser = await UserModel.query().findOne({ email })

    if (existingUser) {
      res.send({ status: "OK" })

      return
    }

    const [hash, salt] = UserModel.getHashPassword(password)

    await UserModel.query().insert({
      email,
      passwordHash: hash,
      passwordSalt: salt,
      displayName,
      role_id: 1,
    })

    res.send({ status: "OK" })
  })

  app.post("/sign-in", async (req, res) => {
    const {
      body: { email, password },
    } = req

    const user = await UserModel.query().findOne({ email })

    if (!user || !user.checkPassword(password)) {
      res.status(401).send({ error: "invalid credentiels" })

      return
    }

    const jwt = jsonwebtoken.sign(
      {
        payload: {
          user: {
            id: user.id,
            email: user.mail,
            username: user.displayName,
            roleId: user.role_id,
          },
        },
      },
      config.security.password.secret,
      { expiresIn: config.security.password.expiresIn }
    )
    // eslint-disable-next-line no-unused-vars
    const { passwordHash, passwordSalt, ...other } = user
    res.status(200).send({ auth: jwt, user: other })
  })

  app.put("/session/:id", async (req, res) => {
    const {
      params: { id },
      body: { displayName, password },
    } = req

    const existingUser = await UserModel.query().findById(id)

    if (!existingUser) {
      res.status(404).send({ error: "User not found" })

      return
    }

    const existingUsername = await UserModel.query()
      .findOne({ displayName })
      .whereNot("id", id)

    if (existingUsername) {
      res.status(409).send({ error: "Username already in use" })

      return
    }

    if (password) {
      const [hash, salt] = UserModel.getHashPassword(password)

      await UserModel.query().updateAndFetchById(id, {
        displayName,
        passwordHash: hash,
        passwordSalt: salt,
      })

      res.status(200).send({ message: "Modification success" })

      return
    }

    await UserModel.query().updateAndFetchById(id, {
      displayName,
    })

    res.status(201).send({ message: "Modification success" })
  })
}

export default sessionRoutes
