from datetime import datetime, timezone

from flask import Flask, Response, request, session, render_template_string, render_template, send_from_directory, \
    jsonify
import secrets
import requests

app = Flask(__name__)

API_HOST = "https://gabserver.eu/v1"


@app.route('/v1/<path>', methods=["GET", "POST"])  # NOTE: better to specify which methods to be accepted. Otherwise, only GET will be accepted. Ref: https://flask.palletsprojects.com/en/3.0.x/quickstart/#http-methods
def redirect_to_API_HOST(path):  #NOTE var :path will be unused as all path we need will be read from :request ie from flask import request
    res = requests.request(  # ref. https://stackoverflow.com/a/36601467/248616
        method          = request.method,
        url             = request.url.replace(request.host_url, f'{API_HOST}/'),
        headers         = {k:v for k,v in request.headers if k.lower() != 'host'}, # exclude 'host' header
        data            = request.get_data(),
        cookies         = request.cookies,
        allow_redirects = False,
    )
    #region exlcude some keys in :res response
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']  #NOTE we here exclude all "hop-by-hop headers" defined by RFC 2616 section 13.5.1 ref. https://www.rfc-editor.org/rfc/rfc2616#section-13.5.1
    headers          = [
        (k,v) for k,v in res.raw.headers.items()
        if k.lower() not in excluded_headers
    ]
    #endregion exlcude some keys in :res response

    response = Response(res.content, res.status_code, headers)
    return response

@app.route('/v1/verify_password', methods=["GET", "POST"])
def pass_check():
    data = request.json
    res = requests.post("https://gabserver.eu/v1/verify_password", json={"username": data.get("username"),
                                                                     "password": data.get("password")})
    if res.status_code == 400:
        return jsonify({"code":400,"message":"User does not exist"})
    elif res.status_code == 200:
        return jsonify({"code": 200}), 200
    else:
        return jsonify({"code":401,"message":"Incorrect password!"})

@app.route('/v1/get_balance', methods=["GET", "POST"])
def get_bal():
    data = request.json
    res = requests.post("https://gabserver.eu/v1/get_balance", json={"username": data.get("username")})
    d = res.json()
    d["balance"] = 0
    return jsonify(d)

@app.route('/v1/get_transactions', methods=["GET", "POST"])
def get_trans():
    data = request.json
    res = requests.post("https://gabserver.eu/v1/get_transactions", json={"username": data.get("username")})
    json_d = res.json()
    res = requests.post("https://gabserver.eu/v1/get_balance", json={"username": data.get("username")})
    d = res.json()
    dt = datetime.now(tz=timezone.utc)

    # Format the datetime object as a string in the desired format
    timestamp = dt.strftime('%a, %d %b %Y %H:%M:%S GMT')
    if d["balance"] != 0:
        json_d["data"].insert(0,[666, data.get("username"), "iraas", timestamp,d["balance"], "You lost your blue coin :)"])
    return jsonify(json_d)

@app.route('/v1/get_users', methods=["GET", "POST"])
def get_user():
    res = requests.post("https://gabserver.eu/v1/get_users")

    return jsonify(res.json())

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route('/ATM/', methods=['GET', 'POST'])
def login():
    return render_template("login.html")

@app.route('/ATM/webui', methods=['GET', 'POST'])
def ATM():
    return render_template("site.html")

@app.route('/ATM/signup/', methods=['GET', 'POST'])
def signup():
    return render_template("signup.html")

@app.route('/ATM/client.js/', methods=['GET', 'POST'])
def client():
    return send_from_directory('static', "client.js")

@app.route('/ATM/base64.js/', methods=['GET', 'POST'])
def base64():
    return send_from_directory('static', "base64.js")

@app.route('/ATM/sha1.js/', methods=['GET', 'POST'])
def sha1():
    return send_from_directory('static', "sha1.js")


if __name__ == '__main__':
    app.run(debug=True)
