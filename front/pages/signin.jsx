import { Formik, Field, Form } from "formik"
import { useCallback, useContext } from "react"
import AppContext from "../src/components/AppContext.jsx"
import * as Yup from "yup"
import Navbar from "../src/components/Navbar.jsx"

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Must be a valid email").required("Email required"),
  password: Yup.string().required("Password required"),
})

const SignIn = () => {
  const { signIn } = useContext(AppContext)

  const handleFormSubmit = useCallback(
    async ({ email, password }) => {
      return signIn(email, password)
    },
    [signIn]
  )

  return (
    <div>
      <Navbar />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <div className="flex items-center justify-center ">
            <div className="row">
              <div className="block text-grey-darker text-sm font-bold mb-2">
                <Form>
                  <div className="form-group">
                    <label className="mt-2">Email</label>
                    <Field
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                    {touched.email && errors.email ? (
                      <div className="text-red-500">{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="">
                    <label className="">Password</label>
                    <Field
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    {touched.password && errors.password ? (
                      <div className="text-red-500">{errors.password}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="px-6 py-2 mt-4 text-white bg-black mb-6"
                    >
                      Se connecter
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default SignIn
