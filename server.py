import http.server
import socketserver
import os

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Añadir headers CORS si es necesario
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def guess_type(self, path):
        # Sobreescribir los tipos MIME para JavaScript y CSS
        base, ext = os.path.splitext(path)
        if ext == '.js':
            return 'application/javascript'
        elif ext == '.mjs':
            return 'application/javascript'
        elif ext == '.css':
            return 'text/css'
        # Para otros tipos, usar el comportamiento predeterminado
        return super().guess_type(path)

# Crear el servidor con el manejador personalizado
with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
    print(f"Servidor iniciado en http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
