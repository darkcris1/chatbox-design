const chatMessages = document.querySelector(".chatMessages"),
	  chatForm = document.querySelector(".chatBox form"),
	  nameInput = document.querySelector(".chatBox .inputName > input"),
	  nameBtn = document.querySelector(".chatBox .inputName > button"),
	  message = document.querySelector(".chatBox form #chatText"),
	  LOCAL_STORAGE_CHAT_KEY = "messages.text",
	  LOCAL_STORAGE_STYLE_KEY = "messages.style",
	  chatMessageList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHAT_KEY)) || [],
	  chatStyleList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STYLE_KEY)) || []
	  
	

chatForm.addEventListener("submit",e=>{
	e.preventDefault()
	const blankSpace = /^\s+/
	let messageValue = message.innerText
	if(!messageValue.trim())return
	messageValue = messageValue.replace(/^\s+|\s+$/gm,"")
	const chatList = createList(messageValue,user())
	chatMessageList.push(chatList)
	saveAndAddChats()
	message.innerText = ''
	chatMessages.scrollTop = chatMessages.scrollHeight
	message.focus()
})
function toggleWidth(){
}
message.addEventListener("focus",function(){
	this.style.width = `${90}%`
})
message.addEventListener("blur",function(){
	if (this.innerText != "")return
		this.style.width = `${30}%`
})
function saveAndAddChats(){
	save()
	addChatMessage()
}
function createList(chats){
	return {
		id: Date.now().toString().slice(5,9),
		chatMessages: chats
	}
}

function save(){
	localStorage.setItem(LOCAL_STORAGE_CHAT_KEY,JSON.stringify(chatMessageList));
	localStorage.setItem(LOCAL_STORAGE_STYLE_KEY,JSON.stringify(chatStyleList));
}
function addChatMessage(){
	const div = document.createElement("div"),
		  username = user(),
		  messageValue = message.innerText.replace(/^\s+|\s+$/gm,""),
		  divText = document.createTextNode(messageValue)
	div.setAttribute("class","message")
	div.appendChild(divText)
	chatMessages.appendChild(div)
	addLongPressEvent()
}
function refreshSave(){
	chatMessageList.forEach(chats=>{
		const div = document.createElement("div")
		const divText = document.createTextNode(`${chats.chatMessages}`)
//		div.style.cssText = "box-shadow: 0 0 0 2px red;font-size: .50rem;pointer-events: none;"
		div.appendChild(divText)
		chatMessages.appendChild(div)
		div.classList.add("message")
		
		for (var i = 0; i < chatStyleList.length; i++) {
			if (chats.id === chatStyleList[i]) {
				div.className += " deleted"
				div.innerText = "Message Removed"
			}
		}
		addLongPressEvent()
	})
}

window.onload = function (){
	refreshSave()
	const view = document.querySelector("meta[name=viewport]")
	view.setAttribute("content",`width=device-width,height=${window.innerHeight},initial-scale=1`)
}
nameBtn.addEventListener("click",()=>{
	const chatBox = document.body.children[0].querySelector(".chatRoom");
	if (!nameInput.value.trim()) return;
	nameBtn.parentElement.style.display = "none"
	chatBox.style.display = 'block'
	chatMessages.scrollTo(0,chatMessages.scrollHeight)
})

function user(){
	return nameInput.value;
}
function clearChat(e){
	e.preventDefault()
	var confirmBtn = confirm('Are you sure you want to clear all Conversation ?')
	if (confirmBtn) {
		chatMessages.innerHTML = null
		localStorage.removeItem(LOCAL_STORAGE_CHAT_KEY)
		localStorage.removeItem(LOCAL_STORAGE_STYLE_KEY)
	}
}

let timePress = 0,timeInterval
var messageDiv = document.getElementsByClassName('message');
function addLongPressEvent(){
	for (var i = 0; i < messageDiv.length; i++) {
		long_press(messageDiv[i]);
		long_press_remove(messageDiv[i]);
	}
}
function long_press_remove(loop){
	loop.ontouchend=function(){
		clearTimeout(timeInterval)
	}
}
function long_press(loop){
	loop.ontouchstart=function(){
		timeInterval = setTimeout(function() {
			var confirmDelete = confirm("Are You Sure You Want To delete this ?")
			if (confirmDelete) {
				chatMessageList.forEach(chats=>{
					if (chats.chatMessages == loop.innerHTML){
						chatStyleList.push(chats.id)
					}
				})
				loop.innerHTML = "Message Removed"
				loop.className += " deleted"
				save()
			}
		}, 500);
	}
}