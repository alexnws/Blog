import Navbar from "../../src/components/Navbar.jsx"
import { useRouter } from "next/router"
import { useState, useEffect, useCallback } from "react"
import api from "../../src/components/utils/api.js"
import Link from "next/link"
export default function UserId() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const {
    query: { userId },
  } = useRouter()
  const handleDelete = useCallback(async () => {
    await api.delete(`/users/${userId}`)
    localStorage.clear()
    router.push("/")
  })
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (userId) {
      api.get(`/users/${userId}`).then((response) => setUser(response.data))
    }
  }, [userId])

  if (!user) {
    return <div> Loading . . .</div>
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col">
        <div className="text-center text-2xl font-bold">
          Name :{user.displayName}
        </div>
        <div className="text-center text-2xl font-bold">
          Email :{user.email}
        </div>
        <div className="text-center text-2xl font-bold">
          {" "}
          Role : {user.role}
        </div>
        <Link href={`/users/${encodeURIComponent(userId)}/accountModif`}>
          <a className="text-center ">
            <button className="mt-5 py-5 px-5 bg-black text-white font-bold">
              <p>Modify Account</p>
            </button>
          </a>
        </Link>
        <Link href={`/users/${userId}`}>
          <a className="text-center ">
            <button
              className="mt-5 py-5 px-5 bg-black text-white font-bold"
              onClick={handleDelete}
            >
              <p>Delete Account</p>
            </button>
          </a>
        </Link>
      </div>
    </>
  )
}
