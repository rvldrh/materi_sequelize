const bookModel = require(`../models/index`).book
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const multer = require(`multer`)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./cover`)
  },
  filename: (req, file, cb) => {
    cb(null, `cover${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`]
    if (!acceptedType.includes(file.mimetype)) {
      cb(null, false)
      return cb(`Invalid file type (${file.mimetype})`)
    }
    const fileSize = req.headers[`content-length`]
    const maxSize = (1 * 1024 * 1024) // max: 1MB
    if (fileSize > maxSize) {
      cb(null, false)
      return cb(`File size is too large`)
    }
    cb(null, true)
  }
}).single(`cover`)

exports.getAllBooks = async (request, response) => {
  let books = await bookModel.findAll()
  return response.json({
    success: true,
    data: books,
    message: `All Books have been loaded`
  })
}

exports.findBook = async (request, response) => {
  let keyword = request.body.keyword
  let books = await bookModel.findAll({
    where: {
      [Op.or]: [
        { isbn: { [Op.substring]: keyword } },
        { title: { [Op.substring]: keyword } },
        { author: { [Op.substring]: keyword } },
        { category: { [Op.substring]: keyword } },
        { publisher: { [Op.substring]: keyword } }
      ]
    }
  })
  return response.json({
    success: true,
    data: books,
    message: `All Books have been loaded`
  })
}

exports.addBook = (request, response) => {
  upload(request, response, async error => {
    if (error) {
      return response.json({ message: error })
    }
    if (!request.file) {
      return response.json({ message: `Nothing to Upload` })
    }

    let newBook = {
      isbn: request.body.isbn,
      title: request.body.title,
      author: request.body.author,
      publisher: request.body.publisher,
      category: request.body.category,
      stock: request.body.stock,
      cover: request.file.filename
    }

    bookModel.create(newBook)
      .then(result => {
        return response.json({
          success: true,
          data: result,
          message: `New book has been inserted`
        })
      })
      .catch(error => {
        return response.json({
          success: false,
          message: error.message
        })
      })
  })
}

exports.updateBook = async (request, response) => {
  upload(request, response, async error => {
    if (error) {
      return response.json({ message: error })
    }

    let bookID = request.params.id
    let book = {
      isbn: request.body.isbn,
      title: request.body.title,
      author: request.body.author,
      publisher: request.body.publisher,
      category: request.body.category,
      stock: request.body.stock
    }

    if (request.file) {
      const selectedBook = await bookModel.findOne({
        where: { id: bookID }
      })
      const oldCoverBook = selectedBook.cover
      const pathCover = path.join(__dirname, `../cover`, oldCoverBook)
      if (fs.existsSync(pathCover)) {
        fs.unlink(pathCover, error => console.log(error))
      }
      book.cover = request.file.filename
    }

    bookModel.update(book, { where: { id: bookID } })
      .then(result => {
        return response.json({
          success: true,
          message: `Data book has been updated`
        })
      })
      .catch(error => {
        return response.json({
          success: false,
          message: error.message
        })
      })
  })
}

exports.deleteBook = async (request, response) => {
  const bookID = request.params.id
  const book = await bookModel.findOne({ where: { id: bookID } })
  const oldCoverBook = book.cover
  const pathCover = path.join(__dirname, `../cover`, oldCoverBook)
  if (fs.existsSync(pathCover)) {
    fs.unlink(pathCover, error => console.log(error))
  }

  bookModel.destroy({ where: { id: bookID } })
    .then(result => {
      return response.json({
        success: true,
        message: `Data book has been deleted`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}
