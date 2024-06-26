from gevent.pywsgi import WSGIServer
from main import app

http_server = WSGIServer(("0.0.0.0", 8080), app)
print("running at port 0.0.0.0:8080")
http_server.serve_forever()
