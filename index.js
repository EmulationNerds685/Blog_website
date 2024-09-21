import express from 'express'
import bodyParser from 'body-parser'
import pg from 'pg'
const app = express()
const port = 4000

function current_date(){
	const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); 
const year = today.getFullYear(); 
const formattedDate = `${day}/${month}/${year}`;

return formattedDate
}

const db = new pg.Client({
	user: 'postgres',
	host: 'localhost',
	database: 'Task',
	password: 'Krusty685',
	port: 5432
})
db.connect()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM posts')
		res.render('index.ejs', { posts: result.rows })
	} catch (err) {
		console.log('Error displaying')
	}
})

app.post('/submit', (req, res) => {
	res.render('create_post.ejs')
})

app.post('/create', async (req, res) => {
	try {
		const title = req.body.title
		const content = req.body.content
		const author = req.body.auth
		const today_date=current_date()
		const result = await db.query(
			'INSERT INTO posts(title,content,author,date) VALUES($1,$2,$3,$4)',
			[title, content, author,today_date]
		)
		console.log('Post Created!')
		res.redirect('/')
	} catch (err) {
		console.log('Error inserting!')
	}
})
app.post('/edit', async (req, res) => {
	try {
		const id = req.body.ItemId
		const result = await db.query('SELECT * FROM posts WHERE id= $1', [id])
		res.render('edit_post.ejs', { posts: result.rows })
	} catch (err) {
		console.log('Error')
	}
})

app.post('/update', async (req, res) => {
	try {
		const id = req.body.ItemId
		const title = req.body.title
		const content = req.body.content
		const author = req.body.auth
		const result = await db.query(
			'UPDATE posts SET title=$1,content=$2,author=$3 WHERE id=$4',
			[title, content, author, id]
		)
		res.redirect('/')
	} catch (err) {
		console.log('Error Updating!')
	}
})

app.post('/delete', async (req, res) => {
	try {
		const id = req.body.deletedItemId
		const result = db.query('DELETE FROM posts WHERE id=$1', [id])
		console.log('Deleted!')
		res.redirect('/')
	} catch (err) {
		console.log('Error Deleting!')
	}
})
app.get('/home', (req, res) => {
	res.redirect('/')
})
app.listen(port, () => {
	console.log(`Server is running on port: http://localhost:${port} `)
})
