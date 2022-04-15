import { useCallback, useContext } from "react"
import { Form, Formik, Field } from "formik"
import * as Yup from "yup"
import AppContext from "./AppContext"
import api from "./utils/api"

const displayingErrorMessagesSchema = Yup.object().shape({
  content: Yup.string()
    .max(500, "Must be at most 500 characters")
    .required("Required field"),
})

const CreateCommentForm = ({ postId }) => {
  const { router, session } = useContext(AppContext)
  const user_id = JSON.parse(session).payload.user.id

  const handleFormSubmit = useCallback(
    async ({ content }) => {
      await api.post(`/comments`, {
        content,
        user_id,
        postId,
      })
      router.reload()
    },
    [router, user_id, postId]
  )

  return (
    <>
      <section className="flex items-center justify-center ">
        <div className="">
          <h2 className="text-2xl font-bold">Create comment</h2>
          <Formik
            initialValues={{
              content: "",
            }}
            validationSchema={displayingErrorMessagesSchema}
            onSubmit={handleFormSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <label className="flex flex-col p-4 font-bold">
                  Content
                  <Field
                    className="p-4 mb-2 mt-2 border-2"
                    name="content"
                    placeholder="content"
                    type="textarea"
                  />
                  {errors.content && touched.content && (
                    <div
                      className={`${errors.content ? "text-red-500" : null}`}
                    >
                      {errors.content}
                    </div>
                  )}
                </label>
                <button
                  className="px-6 py-4 mt-4 text-white bg-black mb-6 "
                  type="submit"
                >
                  Create comment
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  )
}

export default CreateCommentForm
