const express = require(`express`)
const app = express()
const port = 8000

const memberRoute = require(`./routes/member.route`)
const bookRoute = require(`./routes/book.route`)
const borrowRoute = require(`./routes/borrow.route`)

app.use(`/members`, memberRoute)
app.use(`/books`, bookRoute)
app.use(`/borrows`, borrowRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
