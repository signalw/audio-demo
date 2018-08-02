from bottle import route, run, template, get, post, static_file, request
import os

@route('/')
def index():
    return template('main')

@get('/static/js/<filename:re:.*\.js>')
def js(filename):
    return static_file(filename, root='.')

@post('/submit')
def submit():
    audio = request.files['audio']
    audio.save('audios')

if __name__ == '__main__':
    run(host='0.0.0.0', port=os.environ.get('PORT', 8080))