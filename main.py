from app import app

if __name__ == '__main__':
    app.run(ssl_context='adhoc', debug=True, host="0.0.0.0", port=5001)