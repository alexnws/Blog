import PwdField from "./PasswordType"
import AppContext from "./AppContext"
import api from "./utils/api"
import { Form, Formik, Field } from "formik"
import * as Yup from "yup"
import { useContext, useEffect, useState, useCallback } from "react"
import Navbar from "./Navbar.jsx"

const displayingErrorMessagesSchema = Yup.object().shape({
  displayName: Yup.string()
    .max(10, "Max. 10 characters")
    .required("The field is required"),
  password: Yup.string()
    .min(6, "Max. 6 characters")
    .max(40, "Max. 30 characters")
    .matches(/^.*(?=.*[a-z]).*$/g, "Need at least 1 lowercase")
    .matches(/^.*(?=.*[A-Z]).*$/g, "Need at least 1 uppercase")
    .matches(/^.*(?=.*[0-9]).*$/g, "Need at least 1 number"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Password are not matching"
  ),
})

const AccountModifForm = ({ userId }) => {
  const { router } = useContext(AppContext)
  const [apiError, setApiError] = useState(null)
  const [user, setUser] = useState(null)

  const handleFormSubmit = useCallback(
    async ({ displayName, password }) => {
      try {
        await api.put(`/session/${userId}`, {
          displayName,
          password,
        })
        setApiError(null)
        router.push(`/users/${userId}`)
      } catch (err) {
        setApiError(err.response.data.error)
      }
    },
    [router, userId]
  )

  useEffect(() => {
    if (userId && !isNaN(userId)) {
      api.get(`/users/${userId}`).then((response) => setUser(response.data))
    }
  }, [userId])

  if (!user) {
    return <div>waiting for user...</div>
  }

  return (
    <>
      <Navbar />
      <section className="flex items-center justify-center ">
        <div className="block text-grey-darker text-sm font-bold mb-2">
          {apiError ? <div>{apiError}</div> : null}
          <div className="px-10 py-6">
            <h2 className="text-2xl font-bold">Modify account</h2>
            <Formik
              className=""
              initialValues={{
                displayName: user.displayName,
                password: "",
                confirmPassword: "",
              }}
              validationSchema={displayingErrorMessagesSchema}
              onSubmit={handleFormSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field name="displayName" placeholder="username" />
                  <label className="flex flex-col p-2 font-bold">
                    Password
                    <Field
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                      name="password"
                      placeholder="Enter the new password"
                      as={PwdField}
                    />
                    {errors.password && touched.password && (
                      <div
                        className={`${
                          errors.password
                            ? "popup text-red-600 bg-red-200 rounded-md w-1/3 p-2 font-medium"
                            : null
                        }`}
                      >
                        {errors.password}
                      </div>
                    )}
                  </label>
                  <label className="flex flex-col p-2 font-bold">
                    Confirm password
                    <Field
                      className="p-2 mb-2 mt-2 border-2"
                      name="confirmpassword"
                      placeholder="confirm password"
                      as={PwdField}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div
                        className={`${
                          errors.confirmPassword
                            ? "popup text-red-600 bg-red-200 rounded-md w-1/3 p-2 font-medium"
                            : null
                        }`}
                      >
                        {errors.confirmPassword}
                      </div>
                    )}
                  </label>
                  <button
                    className="px-6 py-2 mt-4 text-white bg-black mb-6"
                    type="submit"
                  >
                    Modify account
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </>
  )
}

export default AccountModifForm
