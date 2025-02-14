const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://tonykuosa:${password}@cluster0.imvp1.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length == 3) {
    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
        process.exit(0)
    })
} else {
    const note_content = process.argv[3]
    const note_importance = process.argv[4]

    const note = new Note({
        content: `${note_content}`,
        important: `${note_importance}`,
    })

    note.save().then(result => {
        console.log(`added ${note.content}, important: ${note.important} to notes`)
        mongoose.connection.close()
        process.exit(0)
    })
    .catch(error => {
        console.log("Something went wrong with adding the note.")
        process.exit(1)
    })
}
