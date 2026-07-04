# model

Project created for testing purposes. Run the script to see model validation
embedded into the Web API pipeline.

Start the application in production mode:

```bash
make prod
```

Make sure [python3](https://www.python.org/downloads/) and
[venv](https://docs.python.org/3/library/venv.html) are installed on the target
system. Create and activate a new virtual environment:

```bash
$ python3 -m venv .venv
$ source .venv/bin/activate
```

Restore dependencies:

```bash
$ pip install -r requirements.txt
```

Run the script:

```bash
$ python3 ./src/index.py
```

Deactivate the virtual environment:

```bash
$ deactivate
```
