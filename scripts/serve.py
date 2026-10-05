"""Local static server for the prototype with caching disabled.

Plain `python -m http.server` lets browsers reuse stale ES modules between edits, which mixes old
and new code. Run from the project root:

    /usr/bin/python3 scripts/serve.py [port]
"""

import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
