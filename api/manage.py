#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rankrise.settings")

    try:
        from django.conf import settings
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Start debug server for VSCode
    if settings.DEBUG:
        if os.environ.get("RUN_MAIN") or os.environ.get("WERKZEUG_RUN_MAIN"):
            import debugpy
            import logging

            # Run server for any IP address on port 3000
            debugpy.listen(("0.0.0.0", 3000))
            # debugpy.wait_for_client()
            logging.debug("Attached!")

    # Execute managment command (e.g. runserver)
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
