import sys
import os
import json

# takes all files to be cached as args
# find *.html images scripts styles version.json -type f
# | python3.6 .github/workflows/setup_cache.py
files = list(sys.stdin)
# prepend slashes to all file paths
files = [f"/{f[:-1]}" for f in files]

sw_content = open("sw.js", "r").read()
sw_content = sw_content.replace("{{COMMIT_SHA}}", os.getenv("GITHUB_SHA"))
sw_content = sw_content.replace("""["{{CACHE_URLS}}"]""",
                                json.dumps(files, indent=2))
sw_file = open("sw.js", "w")
sw_file.write(sw_content)
sw_file.close()
