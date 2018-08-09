(function(){
	var _defaultView = "not_connected"
	var statusViewName = null;

	var config;
	window.machineStatus = {};

	var bind = {
		machine_status:"unconnected"
	}

	window.main = function(){
		utils.bind.val.dynamic = bind;
		utils.bind.defineDynamic();

		$.getJSON( "res/config.json", function( data ) {
			config = data;
			startSockets();

			loadView(_defaultView);
		});
	};

	function putStatusInfoInBinds(){
		bind.machine_status = machineStatus.Status;
		bind.playing_game = machineStatus.Game;
		bind.configured_playtime = machineStatus.ConfiguredPlayTime;
	}

	var reconnectSocketTimeout;

	function startSockets(){
		var socket = new WebSocket("ws://"+config.masterServerIp+"/status");

		socket.onmessage = function(event){
			var msg = JSON.parse(event.data);

			if(msg.Status){
				machineStatus = msg;
				putStatusInfoInBinds();
				loadStatusView(machineStatus.Status);
			}
			else
				bind.machine_status = "unknown";
		}

		//spam reconnection
		socket.onclose = function(){
			reconnectSocketTimeout = setTimeout(startSockets, 1000);
			bind.machine_status = "unconnected";
			loadView(_defaultView);
		}
	}

	function loadStatusView(view){
		loadView("status-"+view);
	}

	function loadView(view){
		if(statusViewName == view) return;

		$("#root").load("views/"+view+".html", function(responseText, textStatus, req){
			if (textStatus == "error") return;

			statusViewName = view;
			applyNewView();
		});
		window.scrollTo(0,0);
	}

	window.dbg_loadView = function(view){
		statusViewName = "";
		clearTimeout(reconnectSocketTimeout);
		loadView(view);
	}

	function applyNewView(){
		$.getJSON("res/translations/" + config.language + ".json", function(data){
			utils.bind.val.static = data;
			utils.bind.parseBindableChilds(document.body);
		})
	}
})();
