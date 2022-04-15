import { useContext, useEffect, useState, useCallback } from "react"
import { Form, Formik, Field } from "formik"
import * as Yup from "yup"
import AppContext from "./AppContext"
import api from "./utils/api"

const displayingErrorMessagesSchema = Yup.object().shape({
  content: Yup.string()
    .max(500, "Must be at most 500 characters")
    .required("Required field"),
})

const CommentsForm = ({ commentId }) => {
  const { router } = useContext(AppContext)
  const [comment, setComment] = useState(null)

  const handleFormSubmit = useCallback(
    async ({ content }) => {
      await api.put(`/comments/${commentId}`, {
        content,
      })
      router.reload()
    },
    [commentId, router]
  )

  useEffect(() => {
    if (commentId && !isNaN(commentId)) {
      api.get(`/comments/${commentId}`).then((out) => setComment(out.data))
    }
  }, [commentId])

  if (!comment) {
    return null
  }

  return (
    <>
      <section>
        <div>
          <h2 className="text-4xl font-bold mb-5">Modify comment</h2>
          <Formik
            initialValues={{
              content: comment.content,
            }}
            validationSchema={displayingErrorMessagesSchema}
            onSubmit={handleFormSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <label className="flex flex-col p-2 font-bold">
                  Content
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    name="content"
                    placeholder="content"
                    type="textarea"
                  />
                  {errors.content && touched.content && (
                    <div
                      className={`${errors.content ? "text-red-600" : null}`}
                    >
                      {errors.content}
                    </div>
                  )}
                </label>
                <button
                  className="mt-5 py-5 px-5 bg-black text-white font-bold"
                  type="submit"
                >
                  Modify comment
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  )
}

export default CommentsForm
