import './App.css';
import {useState} from 'react';


function Header(props){
  return (
    <header>
      <h1><a href="/" onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  );
}


function Nav(props){

  // let lis = [];
  // for(let i=0; i<props.topics.length; i++){
  //   let topic = props.topics[i];
  //   lis.push(<li key={topic.id}><a href={'/read/' + topic.id}>{topic.title}</a></li>);
  // }
  let lis = props.topicList.map(
    (topic) => 
    (<li key={topic.id}>
      <a id={topic.id} href={'/read/' + topic.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{topic.title}</a>
    </li>)
  );
  
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}


function Article(props){
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
  </article>
  );
}


function CreateLink(props){
  return (
    <a href='/create' onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>Create</a>
  );
}


function CreateForm(props){
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        // event.target - 이벤트가 발생한 태그
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title"></input></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create"></input></p>
      </form>
    </article>
  );
}


function UpdateLink(props){
  return (
    <a href={'/update/' + props.topic.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>Update</a>
  );
}


function UpdateForm(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title" value={title} 
        onChange={(event)=>{setTitle(event.target.value)}}></input></p>
        <p><textarea name="body" placeholder="body" value={body} 
        onChange={(event)=>{setBody(event.target.value)}}></textarea></p>
        <p><input type="submit" value="Update"></input></p>
      </form>
    </article>
  );
}


function DeleteButton(props){
  return (
    <input type="button" value="Delete" onClick={(event)=>{
      event.preventDefault();
      // console.log(props);
      props.onDelete(props.topicList, props.id);
    }}/>
  )
}


function DeleteTopic(topicList, id){
  let newTopicList = [];
  for(let i=0; i<topicList.length; i++){
    if(topicList[i].id !== id){
      newTopicList.push(topicList[i]);
    }
  }
  // console.log(newTopicList);
  return newTopicList;
}


function App(){

  const modeList = {
    welcome: 0,
    create: 1,
    read: 2,
    update: 3,
    delete: 4
  }
  const [mode, setMode] = useState(modeList.welcome);
  const [id, setId] = useState(null);
  // mode - state값
  // setMode - state값을 변경하는 함수, 
  //         - 호출될 때, App() 함수가 다시 실행됨
  //         - 리턴값이 변경되어 재 렌더링
  // useState(state초기값)
  const [topicList, setTopicList] = useState([
    {id: 1, title:'HTML', body:'HTML is ...'},
    {id: 2, title:'CSS', body:'CSS is ...'},
    {id: 3, title:'JavaScript', body:'JavaScript is ...'},
  ]);
  let content = null;
  let updateLink = null;
  let deleteButton = null;

  if(mode === modeList.welcome){
    content = <Article title="Welcome" body="Hello, React Web"></Article>;

  } else if(mode === modeList.read){
    let topic = topicList.find((t)=>t.id===id);
    content = <Article title={topic.title} body={topic.body}></Article>;
    updateLink = <li><UpdateLink topic={topic} onChangeMode={()=>{setMode(modeList.update)}}></UpdateLink></li>;
    deleteButton = <li><DeleteButton 
                        topicList={topicList} id={id} 
                        onDelete={(topicList, id)=>{setTopicList(DeleteTopic(topicList, id)); setMode(modeList.welcome)}}>
                    </DeleteButton></li>;

  } else if(mode === modeList.create){
    content = <CreateForm onCreate={(_title, _body)=>{
      const newId = Math.max(...topicList.map((topic)=>(topic.id))) + 1;
      const newTopic = {id: newId, title: _title, body: _body};
      // console.log(newTopic);
      const newTopicList = [...topicList];  // Array Copy
      newTopicList.push(newTopic);
      setTopicList(newTopicList);
      setMode(modeList.read);
      setId(newId);
    }}></CreateForm>;

  } else if(mode === modeList.update){
    let topic = topicList.find((t)=>t.id===id);
    content = <UpdateForm title={topic.title} body={topic.body} 
      onUpdate={(_title, _body)=>{
        const updatedTopic = {id: id, title: _title, body: _body};
        const newTopicList = [...topicList];  // Array Copy
        const idx = newTopicList.map((topic)=>(topic.id)).indexOf(id);
        newTopicList[idx] = updatedTopic;
        setTopicList(newTopicList);
        setMode(modeList.read);
      }}>  
    </UpdateForm>;
  }

  // console.log(topicList);
  return (
    <div className="app">
      <Header title="WEB" onChangeMode={()=>{setMode(modeList.welcome)}}></Header>
      <Nav topicList={topicList} onChangeMode={(_id)=>{setMode(modeList.read); setId(_id);}}></Nav>
      {content}
      <ul>
        <li><CreateLink onChangeMode={()=>{setMode(modeList.create)}}></CreateLink></li>
        {updateLink}
        {deleteButton}
      </ul>
    </div>
  );
}

export default App;
