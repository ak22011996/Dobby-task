import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {
	
	constructor(props) {
			super(props);
			this.state = {
				gitUsers : [], 
				displayData:[],
				searchResult: [],
				textValue:''
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
		//document.getElementById('dashboard').style.display='none';
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
			'Content-Type': 'application/json',
		/*	'Access-Control-Allow-Origin': '*',
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
			//this.refreshPage();
			if(res.response=='success'){
				document.getElementById('registerDiv').style.display='none';
				document.getElementById('loginDiv').style.display='none';
				document.getElementById('searchEngine').style.display='block';
			} else {
				alert(res.response);
			}
		})
	}
	
	getGitUsersInfo = function(userName) {
		console.log('getGitUsersInfo');
		var url = "https://api.github.com/search/users?q="+userName;
		console.log(url);
		
		const request = async (e) => {
			try {
				const response = await fetch(url);
				const json = await response.json();
				console.log(json.items);
				this.setState({
					gitUsers: json.items
				})
			} catch(e){
				console.log("error "+ e);
			}
			
		}
		request();
		
	}
	handleChange = function(event){
		var inputVal = event.target.value;
		var filteredData=[];
		if(inputVal){
			this.state.textValue=inputVal;
			if(this.state.searchResult && this.state.searchResult.length >0){
				console.log("INSIDE");
				filteredData = this.state.searchResult.filter(function(gitUser){
					if(gitUser.login.toLowerCase().match(inputVal.toLowerCase())){
						return gitUser;
					}
				});
			} 
			if(filteredData && filteredData.length==0) {
				this.getGitUsersInfo(inputVal);
				if(this.state.gitUsers){
					console.log("AKS");
					filteredData = this.state.gitUsers.filter(function(gitUser){
						if(gitUser.login.toLowerCase().match(inputVal.toLowerCase())){
							return gitUser;
						}
					});
					for(var i in filteredData){
						if(!this.state.searchResult.includes(filteredData[i])){
							this.state.searchResult.push(filteredData[i]);
						}
					}
					console.log("AKS "+ filteredData);
				} 
			}
		} 
		this.setState({
			displayData : filteredData
		});
		console.log("END");
		console.log(this.state.searchResult);
		console.log(this.state.displayData);
		console.log(this.state.gitUsers);
		console.log("END");
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
					Password : <input id="passInput" type="Password" placeholder="Enter your Password"required /><br/><hr/>
					<button id="saveButton" onClick={()=>this.saveRegistrationDetail()}>Sign Up</button><br/>
					<button onClick={()=>this.handlePageChange()}>Sign In</button>
				</div>
				<div id="loginDiv" style={{display: 'none'}}>
					UserName : <input  type="text" id="loginNameInput" placeholder="Enter your email"required /><br/>
					Password : <input type="Password" id="loginPassInput" placeholder="Enter your Password"required/ ><br/>
					<button id="loginButton" onClick={()=>this.handleLoginPage()}>Sign In</button>
				</div>	
				<div id="searchEngine" style={{display: 'none'}}>
					<input type="text" onChange={this.handleChange.bind(this)} placeholder="Search here..." />
					<div className="suggestions">
						{this.state.displayData.map(function(v){
								return (<div className='search' style={{Color:'white'}}>{v.login} <button className="deleteButton" onClick={function(){ 
									
									alert('user deleted');
								}}>Delete</button></div>)
							})
						}.
					</div>
				</div>
			</div>	
		);
	}
}