import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 4000
const posts = []

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.render('index.ejs', { posts: posts })
})

app.post('/submit', (req, res) => {
	res.render('create_post.ejs')
})

app.post('/create', (req, res) => {
	const newPost = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.auth
	}
	posts.push(newPost)
	res.redirect('/')
})

app.get('/edit/:id', (req, res) => {
	const postId = req.params.id
	const post = posts[postId]
	res.render('edit_post.ejs', { post: post, postId: postId })
})

app.post('/update/:id', (req, res) => {
	const postId = req.params.id
	const updatedPost = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.auth
	}
	posts[postId] = updatedPost
	res.redirect('/')
})

app.post('/delete/:id', (req, res) => {
	const postId = req.params.id
	posts.splice(postId, 1)
	res.redirect('/')
})
app.get('/home', (req, res) => {
	res.redirect('/')
})
app.listen(port, () => {
	console.log(`Server is running on port: ${port} `)
})
