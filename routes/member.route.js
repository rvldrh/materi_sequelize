const express = require(`express`)
const app = express()

app.use(express.json())

const memberController = require(`../controllers/member.controller`)

app.get("/", memberController.getAllMembers)

app.post("/find", memberController.findMember)

app.post("/", memberController.addMember)

app.put("/:id", memberController.updateMember)

app.delete("/:id", memberController.deleteMember)

module.exports = app
