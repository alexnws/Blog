import { useContext } from "react"
import ListUser from "../src/components/ListUser.jsx"
import AppContext from "../src/components/AppContext.jsx"
import Navbar from "../src/components/Navbar.jsx"
const Users = () => {
  const { session, router } = useContext(AppContext)
  const userRoleId = JSON.parse(session).payload.user.roleId

  if (userRoleId != 3) {
    router.back()

    return null
  }

  return (
    <>
      <Navbar />
      <ListUser />
    </>
  )
}

Users.private = true

export default Users
