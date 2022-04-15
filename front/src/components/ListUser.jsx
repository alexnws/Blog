import Link from "next/link"
import { useEffect, useState } from "react"
import api from "../components/utils/api.js"

const UsersList = () => {
  const [users, setUsers] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) =>
        setApiError(error.response ? error.response.data.error : error.message)
      )
  }, [])

  if (apiError) {
    return (
      <div className="py-2 w-3/5 bg-red-300 flex justify-center text-center ">
        {apiError}
      </div>
    )
  }

  if (!users) {
    return (
      <div className="flex-col justify-center text-center items-center font-bold">
        waiting for user...
      </div>
    )
  }

  return (
    <div>
      <h2 className="flex px-5 py-5 text-2xl underline mb-2 bg-red-400 rounded-t font-bold">
        Users lists
      </h2>
      <ul className="mb-10">
        {users.map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center justify-between mb-2 px-2 py-2 ${
              index % 2 == 0 ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <div className="flex items-center justify-between text-xl">
              <p className="mr-10 font-bold">
                Username:{" "}
                <p className="font-normal underline">{item.displayName}</p>
              </p>
              <p className="mr-10 font-bold">
                Email: <p className="font-normal underline">{item.email}</p>
              </p>
              <p className="mr-10 font-bold">
                Role: <p className="font-normal underline">{item.role}</p>
              </p>
            </div>
            <Link href={`users/${item.id}`}>
              <a
                className=" text-white bg-black  text-lg font-bold border px-4 py-2"
                type="submit"
              >
                Account
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersList
