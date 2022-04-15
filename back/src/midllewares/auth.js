import jsonwebtoken, { JsonWebTokenError } from "jsonwebtoken"
import config from "../config.js"

const auth = async (req, res, next) => {
  const {
    headers: { authentification: jwt },
  } = req

  if (!jwt) {
    res.status(403).send({ error: " Don't pass" })

    return
  }

  try {
    const payload = jsonwebtoken.verify(jwt, config.security.password.secret)

    req.playload = payload

    next()
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(403).send({ error: "Don't pass" })

      return
    }

    res.status(500).send({ error: "oups" })
  }
}

export default auth
