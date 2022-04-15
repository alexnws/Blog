import { Model } from "objection"
import UserModel from "./User.js"

class RoleModel extends Model {
  static tableName = "roles"

  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: UserModel,
        join: {
          from: "roles.id",
          to: "users.role_id",
        },
      },
    }
  }
}

export default RoleModel
