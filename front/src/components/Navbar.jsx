import Link from "next/link"
import AppContext from "./AppContext.jsx"
import { useContext, useEffect, useState } from "react"
import { FaUser } from "react-icons/fa"

const Navbar = () => {
  const { session, signOut } = useContext(AppContext)
  const [id, setId] = useState(null)

  useEffect(() => {
    if (!session) {
      return
    }

    setId(JSON.parse(session).payload.user.id)
  }, [session])

  return (
    <div>
      <nav className="">
        <div className="h-20 px-10 mb-8 flex flex-row items-center justify-between bg-black text-white">
          <Link href="/">
            <a className=" text-lg flex flex-row items-center justify-between">
              Blog Project
            </a>
          </Link>
          {session ? (
            <div className="flex space-x-4">
              <Link href={`/users/${id}`}>
                <a className="">
                  <FaUser />
                </a>
              </Link>
              <button className="" onClick={signOut}>
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex space-x-4" id="navbarSupportedContent">
              <Link href="/signup">
                <a className="">Sign-Up</a>
              </Link>
              <Link href="/signin">
                <a className="">Sign-In</a>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
