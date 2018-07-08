(function(){
	var statusViewName = null;
	
	var config;
	window.machineStatus = {};

	var bind = {
		machine_status:"unconnected",
	}
	
	window.main = function(){
		utils.bind.val.dynamic = bind;
		utils.bind.defineDynamic();
	
		
		$.getJSON( "res/config.json", function( data ) {
			config = data;
			startSockets();
			
			applyNewView(); //apply translation
		});
	};
	
	function startSockets(){
		var socket = new WebSocket("ws://"+config.masterServerIp+"/status");
		
		socket.onmessage = function(event){
			var msg = JSON.parse(event.data);
			
			if(msg.Status){
				machineStatus = msg;
				bind.machine_status = machineStatus.Status;
				loadView(machineStatus.Status);
			}
			else
				bind.machine_status = "unknown";
		}
		
		//spam reconnection
		socket.onclose = function(){
			setTimeout(startSockets, 1000);
		}
	}
	
	function loadView(view){
		$("#root").load("views/status-"+view+".html", function(responseText, textStatus, req){
			if (textStatus == "error") return;

			statusViewName = view;
			applyNewView();
		});
		window.scrollTo(0,0);
	}
	
	window.dbg_loadView = loadView;

	function applyNewView(){
		$.getJSON("res/translations/" + config.language + ".json", function(data){
			utils.bind.val.static = data;
			utils.bind.parseBindableChilds(document.body);
		})
	}
})();