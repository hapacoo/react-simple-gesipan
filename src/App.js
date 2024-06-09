
import './App.css';
import {useState} from 'react';

function Header(props){
  return<header>
    <h1><a href="/" onClick={(event) => {
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props){
  const lis = []
  for(let i=0; i<props.Lists.length; i++){
    let t = props.Lists[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read'+t.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a></li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Arcitle(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event =>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="제목" /></p>
      <p><textarea name="body" placeholder='내용'></textarea></p>
      <p><input type="submit" value="저장"></input></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Create</h2>
    <form onSubmit={event =>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="제목" value={title} onChange={event =>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder='내용' value={body} onChange={event =>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="수정"></input></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('HAPACOO');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [Lists, setLists] = useState([
    {id:1, title:'가나다라', body:'lalalalala'},
    {id:2, title:'마바', body:'babababa'},
    {id:3, title:'사쟈탸캬', body:'kakakaka'}
  ])
  let content = null;
  let contextControl = null;
  if(mode === 'HAPACOO'){
    content = <Arcitle title="INDEX" body="Welcome hapacoo gesipan"></Arcitle>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<Lists.length; i++){
      if(Lists[i].id === id){
        title = Lists[i].title;
        body = Lists[i].body;
      }
    }
    content = <Arcitle title={title} body={body}></Arcitle>
    contextControl = <>
      <li><a href={'/update/'+id} onClick={event =>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="삭제" onClick={()=>{
        const newLists = []
        for(let i=0; i<Lists.length; i++){
          if(Lists[i].id !== id){
            newLists.push(Lists[i]);
          }
        }
        setLists(newLists);
        setMode('HAPACOO');
      }}></input></li>
    </>
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body) =>{
      const newList={id:nextId, title:_title, body:_body}
      const newLists = [...Lists]
      newLists.push(newList);
      setLists(newLists);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<Lists.length; i++){
      if(Lists[i].id === id){
        title = Lists[i].title;
        body = Lists[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) =>{
      const newLists = [...Lists]
      const updatedList = {id:id, title:title, body:body}
      for(let i=0; i<newLists.length; i++){
        if(newLists[i].id === id){
          newLists[i] = updatedList;
          break;
        }
      }
      setLists(newLists);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title="HAPACOO" onChangeMode={() => {
        setMode('HAPACOO');
      }}></Header>
      <Nav Lists={Lists} onChangeMode={(id) => {
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
     <ul>
      <li><a href="/create" onClick={(event) =>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li> 
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
