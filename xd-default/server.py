import http.server
import socketserver
import sys
import os
import json
import configparser

#====
#update videos list
videos_dir = "res/videos/"
json_video_list_file = videos_dir + "list.json"

if os.path.isfile(json_video_list_file):
	os.remove(json_video_list_file)
	
json_video_list = os.listdir(videos_dir)

#save to json
with open(json_video_list_file, 'w') as json_video_list_file:
    json.dump(json_video_list, json_video_list_file, sort_keys=True, indent=2, ensure_ascii=False, separators=(',', ': '))

#===
#load ini config
config = configparser.ConfigParser()
config.optionxform = str
config.read('config.ini')

data = {}
for key in config['Global']:  
	data[key] = config['Global'][key]

with open('res/config.json', 'w') as outfile:
    json.dump(data, outfile)
	
#====
#start server
PORT = 8000

if len(sys.argv) > 1:
	PORT = int(sys.argv[1])

Handler = http.server.SimpleHTTPRequestHandler

#begin listening
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()