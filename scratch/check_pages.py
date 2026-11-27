import glob, re

for f in sorted(glob.glob('web/src/pages/*.jsx')):
    with open(f, encoding='utf-8') as fp:
        content = fp.read()
        classes = re.findall(r'className="([^"]*)"', content)
        print(f"{f}:")
        for c in classes[:4]:
            if 'max-w' in c or 'min-h' in c or 'p-' in c or 'px-' in c or 'w-' in c:
                print(f"   {c}")
