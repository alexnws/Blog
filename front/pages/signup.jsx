import { Formik, Field, Form } from "formik"
import { useCallback, useContext } from "react"
import AppContext from "../src/components/AppContext.jsx"
import * as Yup from "yup"
import PasswordType from "../src/components/PasswordType.jsx"
import Navbar from "../src/components/Navbar.jsx"

const validationSchema = Yup.object().shape({
  displayName: Yup.string().required("Username required"),

  email: Yup.string().email("Must be an email").required("Email required"),

  password: Yup.string()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Password required"),

  passwordCheck: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password confirmation required")
    .required("Required field"),
})

const SignUp = () => {
  const { signUp } = useContext(AppContext)

  const handleFormSubmit = useCallback(
    async ({ displayName, email, password }) => {
      return signUp(displayName, email, password)
    },
    [signUp]
  )

  return (
    <div>
      <Navbar />
      <Formik
        initialValues={{
          displayName: "",
          email: "",
          password: "",
          passwordCheck: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <div className="flex items-center justify-center">
            <div className="block text-grey-darker text-sm font-bold mb-2">
              <Form>
                <div className="form-group">
                  <label>Username</label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="displayName"
                    name="displayName"
                    placeholder="Username"
                  />
                  {touched.displayName && errors.displayName ? (
                    <div className="text-red-500">{errors.displayName}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-500">{errors.email}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="password"
                    as={PasswordType}
                    name="password"
                    placeholder="Password"
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-500">{errors.password}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label>Confirm password</label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="passwordCheck"
                    as={PasswordType}
                    name="passwordCheck"
                    placeholder="Confirm password"
                  />
                  {touched.passwordCheck && errors.passwordCheck ? (
                    <div className="text-red-500">{errors.passwordCheck}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="px-6 py-2 mt-4 text-white bg-black"
                  >
                    S'inscrire
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default SignUp
