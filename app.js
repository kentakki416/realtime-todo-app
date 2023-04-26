'use strict'
const express = require('express')

let todos = [
  { id: 1, title: 'ネーム', completed: false},
  { id: 2, title: '下書き', completed: true}
]
const app = express()
app.use(express.json())

// Todoの一覧取得
app.get('/api/todos', (req, res) => {
  if (!req.query.completed) {
    return res.json(todos)
  }
  // completedクエリパラメータを指定された場合はToDoをフィルタリング
  const completed = req.query.completed === 'true'
  res.json(todos.filter(todo => todo.completed === completed))
})

let id = 2

app.post('/api/todos', (req, res, next) => {
  const {title} = req.body
  if (typeof title !== 'string' || !title) {
    const err = new Error('title is required')
    err.statusCode = 400
    return next(err)
  }
  // Todoの新規作成
  const todo = { id: id +=1, title, completed: false }
  todos.push(todo)
  res.status(201).json(todo)
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.statusCode || 500).json({ error: err.message })
})

app.listen(3000)