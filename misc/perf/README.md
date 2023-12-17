# Performance tests

To run performance test make sure that the following prerequisites are met:

- [python3](https://www.python.org/downloads/) and [venv](https://docs.python.org/3/library/venv.html) are installed on the target system,
- the latest `perf` dump is loaded to the database,
- the application is up and running in production mode.

Create and activate new virtual environment, activate it, and restore dependencies:

```bash
$ python3 -m venv .venv
$ source .venv/bin/activate
```

Restore dependencies:

```bash
$ pip install -r requirements.txt
```

Execute tests, where `file_name` should be without the `.py` extension:

```bash
$ python3 -m [file_name]
```

Deactivate virtual environment:

```bash
$ deactivate
```
