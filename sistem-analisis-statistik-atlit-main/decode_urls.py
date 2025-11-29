import marshal, types, traceback
path = 'website/__pycache__/urls.cpython-312.pyc'
with open(path, 'rb') as f:
    data = f.read()
code = marshal.loads(data[16:])
module = types.ModuleType('urls_recovered')
try:
    exec(code, module.__dict__)
    print('exec ok')
except BaseException as e:
    print('exec failed', type(e), e)
    traceback.print_exc()
