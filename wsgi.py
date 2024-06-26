from gevent.pywsgi import WSGIServer
from main import app

http_server = WSGIServer(("127.0.0.1", 8000), app)
print("running at port 127.0.0.1:80")
http_server.serve_forever()
