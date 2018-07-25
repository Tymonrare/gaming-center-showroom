import websocket
try:
    import thread
except ImportError:
    import _thread as thread
import time
import configparser
import json
from pywinauto.findwindows    import find_window
import win32gui, win32api, win32con

status = "none"
config = configparser.ConfigParser()
config.read('config.ini')

def connect():
	websocket.enableTrace(True)
	path = "ws://" + config["Global"]["masterServerIp"] + "/status"
	print("Connect to: " + path);
	ws = websocket.WebSocketApp(path,
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
	ws.on_open = on_open
	ws.run_forever()

def on_message(ws, message):
	data = json.loads(message)
	status = data["Status"]
	print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
	print("### closed ###")
	time.sleep(1)
	connect()

def on_open(ws):
    pass

def window_move_thread():
	print("Send foreground")
	while True:
		time.sleep(1)
		if status != "playing" and status != "gamePrepairing":
			try:
				window = find_window(title='XD Showroom')
				win32gui.ShowWindow(window, win32con.SW_RESTORE)
				win32gui.SetWindowPos(window,win32con.HWND_NOTOPMOST, 0, 0, 0, 0, win32con.SWP_NOMOVE + win32con.SWP_NOSIZE)  
				win32gui.SetWindowPos(window,win32con.HWND_TOPMOST, 0, 0, 0, 0, win32con.SWP_NOMOVE + win32con.SWP_NOSIZE)  
				win32gui.SetWindowPos(window,win32con.HWND_NOTOPMOST, 0, 0, 0, 0, win32con.SWP_SHOWWINDOW + win32con.SWP_NOMOVE + win32con.SWP_NOSIZE)
				
				pos = 333
				win32api.SetCursorPos((pos,pos))
				win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,pos,pos,0,0)
				win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,pos,pos,0,0)
			except:
				pass
			#SetForegroundWindow()
	
	
if __name__ == "__main__":
	thread.start_new_thread(window_move_thread, ())
	connect()