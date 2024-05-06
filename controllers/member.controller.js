const memberModel = require(`../models/index`).member
const Op = require(`sequelize`).Op

exports.getAllMembers = async (request, response) => {
  let members = await memberModel.findAll()
  return response.json({
    success: true,
    data: members,
    message: `All Members have been loaded`
  })
}

exports.findMember = async (request, response) => {
  let keyword = request.body.keyword
  let members = await memberModel.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { address: { [Op.substring]: keyword } },
        { phone_number: { [Op.substring]: keyword } }
      ]
    }
  })
  return response.json({
    success: true,
    data: members,
    message: `All Members have been loaded`
  })
}

exports.addMember = (request, response) => {
  let newMember = {
    name: request.body.name,
    email: request.body.email,
    address: request.body.address,
    phone_number: request.body.phone_number
  }

  memberModel.create(newMember)
    .then(result => {
      return response.json({
        success: true,
        data: result,
        message: `New member has been added`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}

exports.updateMember = (request, response) => {
  let updatedMember = {
    name: request.body.name,
    email: request.body.email,
    address: request.body.address,
    phone_number: request.body.phone_number
  }

  let memberID = request.params.id

  memberModel.update(updatedMember, { where: { id: memberID } })
    .then(result => {
      return response.json({
        success: true,
        message: `Member has been updated`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}

exports.deleteMember = (request, response) => {
  let memberID = request.params.id

  memberModel.destroy({ where: { id: memberID } })
    .then(result => {
      return response.json({
        success: true,
        message: `Member has been deleted`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}
