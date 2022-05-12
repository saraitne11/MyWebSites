import './App.css';

function Header(props){
  return (
    <header>
      <h1><a href="/">{props.title}</a></h1>
    </header>
  );
}

function Nav(props){

  // let lis = [];
  // for(let i=0; i<props.topics.length; i++){
  //   let topic = props.topics[i];
  //   lis.push(<li key={topic.id}><a href={'/read/' + topic.id}>{topic.title}</a></li>);
  // }
  let lis = props.topics.map(
    (topic) => 
    (<li key={topic.id}><a href={'/read/' + topic.id}>{topic.title}</a></li>)
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

function App(){

  const topics = [
    {id: 1, title:'HTML', body:'HTML is ...'},
    {id: 2, title:'CSS', body:'CSS is ...'},
    {id: 3, title:'JavaScript', body:'JavaScript is ...'},
  ]

  return (
    <div>
      <Header title="WEB"></Header>
      <Nav topics={topics}></Nav>
      <Article title="Welcome" body="Hello, Web"></Article>
    </div>
  );
}

export default App;
