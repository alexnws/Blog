import { Model } from "objection"
import { pbkdf2Sync, randomBytes } from "crypto"
import RoleModel from "./Role.js"
import PostModel from "./Post.js"
import CommentModel from "./Comment.js"
import config from "../../config.js"

const {
  security: {
    password: { saltLength, iterations, keylen, digest },
  },
} = config

class UserModel extends Model {
  static tableName = "users"

  static get relationMappings() {
    return {
      roles: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.role_id",
          to: "roles.id",
        },
      },
      posts: {
        relation: Model.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "users.id",
          to: "posts.user_id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: CommentModel,
        join: {
          from: "users.id",
          to: "comments.user_id",
        },
      },
    }
  }

  checkPassword = (password) => {
    const [hash] = UserModel.getHashPassword(password, this.passwordSalt)

    return hash === this.passwordHash
  }

  static getHashPassword = (
    password,
    salt = randomBytes(saltLength).toString("hex")
  ) => [
    pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex"),
    salt,
  ]
}

export default UserModel
