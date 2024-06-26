class BlueCoinException extends Error {
    constructor(message) {
        super(message);
        this.name = 'BlueCoinException';
    }
}

function handleResponse(response) {
    return response.json().then(data => {
        if (!response.ok) {
            throw new BlueCoinException(data.message || 'An error occurred');
        }
        return data;
    });
}

function handleResponseNoError(response) {
    return response.json();
}

class BlueCoinClient {
    constructor(baseUrl, noErrorMode = false) {
        this.baseUrl = baseUrl;
        this.noErrorMode = noErrorMode;
    }

    changePassword(username, currentPassword, newPassword) {
        const url = `${this.baseUrl}/v1/change_password`;
        const data = {
            username: username,
            password: currentPassword,
            new_password: newPassword
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    createUser(username, password) {
        const url = `${this.baseUrl}/v1/create_user`;
        const data = {
            username: username,
            password: password
        };
        console.log(JSON.stringify(data))
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    deleteUser(username, password) {
        const url = `${this.baseUrl}/v1/delete_user`;
        const data = {
            username: username,
            password: password
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    getBalance(username) {
        const url = `${this.baseUrl}/v1/get_balance`;
        const data = {
            username: username
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    getTransactions(username) {
        const url = `${this.baseUrl}/v1/get_transactions`;
        const data = {
            username: username
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    getUsers() {
        const url = `${this.baseUrl}/v1/get_users`;
        return fetch(url, {
            method: 'POST'
        }).then(response => this._handleResponse(response));
    }

    powGive(username) {
        const url = `${this.baseUrl}/v1/powgive`;
        const data = {
            username: username
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    powCheck(username, nonce) {
        const url = `${this.baseUrl}/v1/powcheck`;
        const data = {
            username: username,
            nonce: nonce
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    localPowGive(username) {
        const url = `${this.baseUrl}/v1/local_powgive`;
        const data = {
            username: username
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    localPowCheck(username, password, nonce) {
        const url = `${this.baseUrl}/v1/local_powcheck`;
        const data = {
            username: username,
            password: password,
            nonce: nonce
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    getLastMined() {
        const url = `${this.baseUrl}/last_mined`;
        return fetch(url).then(response => this._handleResponse(response));
    }

    takeTransaction(username, password, morsels, recipient, note) {
        const url = `${this.baseUrl}/v1/transaction`;
        const data = {
            username: username,
            password: password,
            morsels: morsels,
            recipient: recipient,
            note: note
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    verifyPassword(username, password) {
        const url = `${this.baseUrl}/v1/verify_password`;
        const data = {
            username: username,
            password: password,
        };
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => this._handleResponse(response));
    }

    _handleResponse(response) {
        if (this.noErrorMode) {
            return handleResponseNoError(response);
        } else {
            return handleResponse(response);
        }
    }
}

class UserBlueCoinClient extends BlueCoinClient {
    constructor(baseUrl, username, password, noErrorMode = false) {
        super(baseUrl, noErrorMode);
        this.username = username;
        this.password = password;
    }

    changePassword(newPassword) {
        return super.changePassword(this.username, this.password, newPassword).then(response => {
            if (response.code === 200) {
                this.password = newPassword;
            }
            return response;
        });
    }

    deleteUser() {
        return super.deleteUser(this.username, this.password).then(response => {
            if (response.code === 200) {
                this.username = null;
                this.password = null;
            }
            return response;
        });
    }

    getBalance() {
        return super.getBalance(this.username);
    }

    getTransactions() {
        return super.getTransactions(this.username);
    }

    powCheck(nonce) {
        return super.powCheck(this.uxsername, nonce);
    }

    powGive() {
        return super.powGive(this.username);
    }

    localPowGive() {
        return super.localPowGive(this.username);
    }

    localPowCheck(nonce) {
        return super.localPowCheck(this.username, this.password, nonce);
    }

    takeTransaction(morsels, recipient, note) {
        return super.takeTransaction(this.username, this.password, morsels, recipient, note);
    }

    verifyPassword() {
        return super.verifyPassword(this.username, this.password);
    }
}