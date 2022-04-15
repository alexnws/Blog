import * as Yup from "yup"
import { Formik, Form, Field } from "formik"
import { useCallback, useContext } from "react"
import AppContext from "./AppContext"
import api from "./utils/api"

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title required"),
  content: Yup.string().required("Content required"),
})

const CreatePost = () => {
  const { router, session } = useContext(AppContext)
  let user_id

  if (session) {
    user_id = JSON.parse(session).payload.user.id
  }

  const handleFormSubmit = useCallback(
    async ({ title, content }) => {
      await api.post(`/posts`, { content, title, user_id })
      router.reload()
    },
    [router, user_id]
  )

  return (
    <>
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-2xl">Create post</h1>

          <Formik
            initialValues={{
              title: "",
              content: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="">
                  <label>Title</label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="title"
                    name="title"
                    placeholder="Title"
                  />
                  {touched.title && errors.title ? (
                    <div className="text-red-600">{errors.title}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="content"
                    name="content"
                    placeholder="Content"
                    as="textarea"
                  />
                  {touched.content && errors.content ? (
                    <div className="text-red-600">{errors.content}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="px-6 py-2 mt-4 text-white bg-black"
                  >
                    Create
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <p className="flex items-center justify-center mt-4 text-xl font-bold leading-1">
        CREATE AN ACCOUNT TO CREATE A POST
      </p>
    </>
  )
}

export default CreatePost
