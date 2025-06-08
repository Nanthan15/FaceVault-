from flask import Flask
from routes.auth import auth_bp
from routes.vault import vault_bp
from routes.share import share_bp
from routes.connection import connection_bp
from routes.received import received_bp

app = Flask(__name__)
app.secret_key = 'supersecurekey'

# Register routes
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(vault_bp, url_prefix='/vault')
app.register_blueprint(share_bp, url_prefix='/share')
app.register_blueprint(connection_bp, url_prefix='/connections')
app.register_blueprint(received_bp, url_prefix='/received')

if __name__ == '__main__':
    app.run(debug=True)
