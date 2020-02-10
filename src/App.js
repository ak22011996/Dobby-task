import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {
	
	constructor(props) {
			super(props);
			this.state = {
				gitUsers : ['abhishek', 'abhimanyu', 'Ravi'], 
				displayData:[],
				textValue : ""
			}
	}
	
	saveRegistrationDetail = function() {
		console.log(document.getElementById('nameInput').value);
		console.log(document.getElementById('emailInput').value);
		console.log(document.getElementById('passInput').value);
		
		fetch('http://localhost:3000/saveRegistrationDetail', {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		/*	'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'*/
		  },
		  body: JSON.stringify({
			name: document.getElementById('nameInput').value,
			email: document.getElementById('emailInput').value,
			pass: document.getElementById('passInput').value
		  })
		})
		.then(res => res.json())
		.then(res => {
			this.refreshPage();
			alert(res.response);
		})
	}
	handlePageChange = function(){
		document.getElementById('registerDiv').style.display='none';
		document.getElementById('loginDiv').style.display='block';
	}
	handleLoginPage = function (){
		document.getElementById('registerDiv').style.display='none';
		document.getElementById('loginDiv').style.display='none';
		document.getElementById('searchEngine').style.display='block';
		fetch('http://localhost:3000/handleLoginPage', {
		  method: 'POST',
		   headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',*/
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'*/
		 },
		  body: JSON.stringify({
			username: document.getElementById('loginNameInput').value,
			userpass: document.getElementById('loginPassInput').value
		  })
		})
		.then(res => res.json())
		.then(res => {
			if(res.response=='success'){
				document.getElementById('registerDiv').style.display='none';
				document.getElementById('loginDiv').style.display='none';
				document.getElementById('searchEngine').style.display='block';
			} else {
				alert(res.response);
			}
		})
	}
	
	handleChange = function(event){
		var inputVal = event.target.value;
		var filteredData=[];
		if(inputVal){
			filteredData = this.state.gitUsers.filter(function(gitUser){
				if(gitUser.toLowerCase().match(inputVal.toLowerCase())){
					return gitUser;
				}
			});
			this.setState({
				displayData : filteredData
			});
		} else {
			this.setState({
				displayData : filteredData
			});
		}
	}
	deleteUser = function(){
		console.log("DeleteUser");
		/*console.log(event);
		var userName = event.target.value;
		console.log("userName "+ userName);*/
		
	}
	
	refreshPage = function() {
	  window.location.reload();
	}
	
	render() {
		 return (
			<div>
				<div id="registerDiv">
					<h1>Register Yourself For Learning</h1>
					Name : <input  type="text" id="nameInput" placeholder="Enter your Name "required />
					Email : <input id="emailInput" type="email" placeholder="Enter your email"required />
					Password : <input id="passInput" type="Password" placeholder="Enter your Password"required /><hr/>
					<button id="saveButton" onClick={()=>this.saveRegistrationDetail()}>Sign Up</button><br/>
					<button onClick={()=>this.handlePageChange()}>Sign In</button>
				</div>
				<div id="loginDiv" style={{display: 'none'}}>
					UserName : <input  type="text" id="loginNameInput" placeholder="Enter your email"required />
					Password : <input type="Password" id="loginPassInput" placeholder="Enter your Password"required/ ><hr/>
					<button id="loginButton" onClick={()=>this.handleLoginPage()}>Sign In</button>
				</div>	
				<div id="searchEngine" style={{display: 'none'}}>
					<input type="text" onChange={this.handleChange.bind(this)} placeholder="Search here..." />
					<div className="suggestions">
						{this.state.displayData.map(function(v){
						return (<div className='search'>{v} <button onClick = {()=>this.deleteUser()}>Delete</button></div>)
					})}
					</div>
				</div>
			</div>	
		);
	}
}