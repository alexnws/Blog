import { Model } from "objection"
import UserModel from "./User.js"
import PostModel from "./Post.js"

class CommentModel extends Model {
  static tableName = "comments"

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
      posts: {
        relation: Model.BelongsToOneRelation,
        modelClass: PostModel,
        join: {
          from: "comments.post_id",
          to: "posts.id",
        },
      },
    }
  }
}

export default CommentModel
