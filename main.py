from flask import Flask, render_template

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route('/')
def home():
    return render_template("base.html", title="Tega")

@app.route('/reset-password')
def reset():
    return render_template("reset.html", title="Tega - Reset Password")

@app.route('/signup')
def signup():
    return render_template("signup.html", title="Tega - Signup")

@app.route('/login')
def login():
    return render_template("login.html", title="Tega - Login")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)