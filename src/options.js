function loadLink() {
	var tbody = document.getElementById("list_body");
	tbody.innerHTML='';
	var linkList = JSON.parse(localStorage['linkList']);
	for(var i=0; i<linkList.length; i++) {
		tbody.appendChild(createLinkRow(linkList[i].facetext, linkList[i].url, linkList[i].pos,linkList[i].active));
	}
}

function createLinkRow(facetext,url,pos,active) {
	var row = document.createElement('tr');
	row.setAttribute('id', 'lkrow'+pos);
		
	var cpos = document.createElement('td');
	var psel = document.createElement('select');
	psel.setAttribute('id', 'psel' + pos);
		
	for(var j=1; j<=10; j++) {
		var opt = document.createElement('option');
		opt.setAttribute('value', j);
		if(j==pos) opt.setAttribute('selected', 'selected');
		opt.appendChild(document.createTextNode(j));
		psel.appendChild(opt);
	}
	psel.onchange=function() { changePos(this.id) };
	cpos.appendChild(psel);	
		
	var ctext = document.createElement('td');
	ctext.innerText = facetext;
	
	var curl = document.createElement('td');
	curl.innerText = url;
	
	var cbtn = document.createElement('td');
	var btn = document.createElement('button');
	btn.innerText = 'Remove';
	btn.setAttribute('id', 'pos'+pos);
	var fctn = function() { removeLink(this.id) };
	btn.onclick = fctn;
	cbtn.appendChild(btn);
	
	var cchk = document.createElement('td');
	var chkbx = document.createElement('input');
	chkbx.setAttribute('type', 'checkbox');
	chkbx.setAttribute('id', 'chk'+pos);
	chkbx.onchange = function() {enableLink(this.id)}
	chkbx.checked = (String(active).toLowerCase() === 'true');
	cchk.appendChild(chkbx);
	
	row.appendChild(cchk);
	row.appendChild(ctext);
	row.appendChild(curl);
	row.appendChild(cpos);
	row.appendChild(cbtn);

	return row;
}

function addLink(cfacetext, cpos, curl) {
	var linkList = JSON.parse(localStorage['linkList']);
	var link={
		facetext:cfacetext,
		pos:cpos,
		url:curl,
		active:true
		};
	
	for(var i=0; i<linkList.length; i++) {
		if (linkList[i].pos == link.pos) {
			alert("The position must be different from the existing ones.");
			return;
		}
	}
	linkList.push(link);
	localStorage['linkList'] = JSON.stringify(linkList);
	loadLink();
}

function saveLink() {
	if (pos.value) {
		addLink(facetext.value, pos.value, linkurl.value);	
	}
}

function removeLink(id) {
	var linkList = JSON.parse(localStorage['linkList']);
	var pos;
	if (id == "pos") {
		pos = "";
	} else {
		pos = /pos([0-9]+)/.exec(id)[1];
	}
	for(var i=0; i<linkList.length; i++) {
		if (linkList[i].pos == pos) {
			linkList.splice(i,1);
			break;
		}
	}
	localStorage['linkList'] = JSON.stringify(linkList);
	var pNode = document.getElementById(id).parentNode.parentNode;
	pNode.parentNode.removeChild(pNode);
	//loadLink();
}

function enableLink(id) {
	var pos = /chk([0-9]+)/.exec(id)[1];
	var linkList = JSON.parse(localStorage['linkList']);
	for(var i=0; i<linkList.length; i++) {
		if (linkList[i].pos == pos) {
			linkList[i].active = document.getElementById(id).checked;
		}
	}
	localStorage['linkList'] = JSON.stringify(linkList);
}

function changePos(id) {
	var psel = document.getElementById(id);
	var newpos = parseInt(psel.value);
	var oldpos = parseInt(/psel([0-9]+)/.exec(id)[1]);
	var tbody = psel.parentNode.parentNode;
	
	var linkList = JSON.parse(localStorage['linkList']);
	var idx = linkList.length;
	for(var i=0; i<linkList.length; i++) {
		if (linkList[i].pos == oldpos) {
			idx = i;
		}
		if (linkList[i].pos == newpos) {
			alert("The position must be different from the existing ones.");
			psel.value = oldpos;
			return;
		}
	}
	if (idx < linkList.length) {
		linkList[idx].pos = newpos;
		updateId(oldpos,newpos);
		localStorage['linkList'] = JSON.stringify(linkList);
	}
	
	return;
}

function updateId(oldpos,newpos) {
	document.getElementById('chk'+oldpos).setAttribute('id','chk'+newpos);
	document.getElementById('psel'+oldpos).setAttribute('id','psel'+newpos);
	document.getElementById('pos'+oldpos).setAttribute('id','pos'+newpos);
	document.getElementById('lkrow'+oldpos).setAttribute('id','lkrow'+newpos);
}

window.addEventListener('load', function() {
  savelink.onclick = function() { saveLink() };
  loadLink();
});


