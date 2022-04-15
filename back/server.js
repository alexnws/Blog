import express from "express"
import { Model } from "objection"
import pino from "pino"
import config from "./src/config.js"
import knex from "knex"
import sessionRoutes from "./src/routes/sessionRoutes.js"
import commentRoutes from "./src/routes/commentRoutes.js"
import postRoutes from "./src/routes/postRoutes.js"
import userRoutes from "./src/routes/UserRoutes.js"
import cors from "cors"

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
})
const app = express()
const db = knex(config.db)

Model.knex(db)
app.use(
  cors({
    origin: process.env.WEB_APP_ORIGIN,
  })
)
app.use(express.json())

sessionRoutes({ app })
commentRoutes({ app })
postRoutes({ app })
userRoutes({ app })

app.listen(config.port, () => logger.info(`Listening on :${config.port}`))
