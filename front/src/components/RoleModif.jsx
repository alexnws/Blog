import { useContext, useEffect, useState, useCallback } from "react"
import { Form, Formik, Field } from "formik"
import AppContext from "../AppContext"
import api from "../utils/api"

import Link from "next/link"

const RoleModifForm = ({ userId }) => {
  const { router } = useContext(AppContext)
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (!isNaN(userId) && userId) {
      api
        .get(`/users/${userId}`)
        .then((response) => setUser(response.data))
        .catch((error) =>
          setApiError(
            error.response ? error.response.data.error : error.message
          )
        )
    }
  }, [userId])

  useEffect(() => {
    api.get("/roles").then((response) => setRoles(response.data))
  }, [])

  const handleFormSubmit = useCallback(
    async ({ role }) => {
      await api.put(`/users/${userId}`, {
        role,
      })
      router.reload()
    },
    [router, userId]
  )

  if (apiError) {
    return null
  }

  if (!user || !roles) {
    return <div>waiting for user role...</div>
  }

  return (
    <section className="mb-10 border-2 rounded shadow">
      <div className="px-10 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-4xl mr-3 font-bold">Modify the user's role :</h3>
          <Formik initialValues={{}} onSubmit={handleFormSubmit}>
            {() => (
              <Form>
                <Field
                  title="role"
                  name="role"
                  as="select"
                  className="px-4 py-3 mr-2 rounded cursor-pointer bg-gray-200"
                  defaultValue={user.role_id}
                >
                  {roles.map((item) => (
                    <option key={item.id} value={item.id} name="role">
                      {item.name}
                    </option>
                  ))}
                </Field>
                <button
                  className="bg-green-500 text-white text-lg font-bold border px-4 py-2 rounded hover:bg-green-300 focus:outline focus:outline-3 focus:outline-green-300  transition-all hover:scale-105"
                  type="submit"
                >
                  Modify role
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <Link href="/users">
          <a className="bg-blue-500 text-white text-lg font-bold border px-4 py-2 rounded hover:bg-blue-300 focus:outline focus:outline-3 focus:outline-blue-300 transition-all hover:scale-105">
            Users list
          </a>
        </Link>
      </div>
    </section>
  )
}

export default RoleModifForm