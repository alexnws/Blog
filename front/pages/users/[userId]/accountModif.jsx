import { useRouter } from "next/router"
import { useContext } from "react"
import AppContext from "../../../src/components/AppContext"
import AccountModification from "../../../src/components/AccountModification.jsx"

const AccountModif = () => {
  const { router, session } = useContext(AppContext)
  const sessionId = JSON.parse(session).payload.user.id

  const {
    query: { userId },
  } = useRouter()

  if (userId != sessionId) {
    router.back()

    return null
  }

  return <AccountModification userId={userId} />
}

AccountModif.private = true

export default AccountModif
