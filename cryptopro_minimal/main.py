import os
import sys

# Permite rodar `python main.py` sem instalar o pacote.
# (Estrutura "src layout": o pacote está dentro de ./src)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

from cryptopro.app import CryptoProApp


if __name__ == "__main__":
    app = CryptoProApp()
    app.mainloop()
