# -*- coding: utf-8 -*-
"""Náhled webu na počítači se stejnými adresami jako na Cloudflaru.

Odkazy na webu jsou bez .html (/koncerty, /en/concerts), takže obyčejný
`python -m http.server` ani otevření souboru z disku nefungují. Tenhle server
dělá totéž co Cloudflare: /koncerty → koncerty.html, /en/ → en/index.html,
neexistující adresa → nejbližší 404.html (v /en/ anglická).

Spuštění z kořene webu:  python docs/scripts/serve.py      → http://localhost:8000
Jiný port:               python docs/scripts/serve.py 8790
"""
import os, sys
from io import BytesIO
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, unquote

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        url = urlsplit(self.path)
        path = unquote(url.path)
        disk = os.path.join(ROOT, path.lstrip('/'))
        if not os.path.isdir(disk) and not os.path.exists(disk) and os.path.isfile(disk + '.html'):
            self.path = path + '.html' + ('?' + url.query if url.query else '')
        elif not os.path.exists(disk):
            return self.not_found(path)
        return super().send_head()

    def not_found(self, path):
        page = os.path.join(ROOT, 'en', '404.html') if path.startswith('/en/') else os.path.join(ROOT, '404.html')
        body = open(page, 'rb').read()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        return BytesIO(body)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print('Web: http://localhost:%d  (Ctrl+C = konec)' % port)
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
