import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import 'isomorphic-fetch'

// 各ページに関する情報の定義
const pages = {
    index: {title: '全てのTodo', fetchQuery: '' },
    active: { title: '未完了のTodo', fetchQuery: '?completed=false'},
    completed: { title: '完了したTodo', fetchQuery: '?completed=true'},
}

// CSRでページを切り替えるためのリンク
const pageLinks = Object.keys(pages).map((page, index) =>
    <Link href={`/${page === 'index' ? '': page}`} key={index}>
        <div style={{ marginRight: 10 }}>{pages[page].title}</div>
    </Link>
)

export default function Todos(props) {
    const {title, fetchQuery} = pages[props.page]

    // コンポーネントの状態の初期化とpropsの値に応じた更新
    const [todos, setTodos] = useState([])

    useEffect(() => {
    //     fetch(`/api/todos${fetchQuery}`)
    //     .then(async res => res.ok ? setTodos(await res.json()): alert(await res.text())
    //     ) 
    
    // EventSourceを使った実装に置き換え　
    const eventSource = new EventSource('/api/todos/events')
    // SSE受信時の処理
    eventSource.addEventListener('message', e => {
        const todos = JSON.parse(e.data)
        setTodos(
            typeof completed === 'undefined'
            ? todos
            : todos.filter(todo => todo.completed === completed)
        )
    })
    // エラーハンドリング
    eventSource.addEventListener('error', e => console.log('SSEエラー', e))
    // useEffect関数を返すと副作用のクリーンアップとして実行される
    // ここでは、EventSourceインスタンスをクローズする
    return () => eventSource.close()
    }, [props.page])

    return (
        <>
        <Head>
            <title>{title}</title>
        </Head>
        <h1>{title}</h1>
        <ul>
            {todos.map(({id, title, completed }) => 
            <li key={id}>
                <span style={completed ? { textDecoration: 'line-through'}: {}}>
                {title}
                </span>
            </li>
            )}
        </ul>
        <div>{pageLinks}</div>
        </>
    )
}
