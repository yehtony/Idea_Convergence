import socketio
import tornado
import json

sio = socketio.AsyncServer(async_mode='tornado',cors_allowed_origins='*')
app = tornado.web.Application(
    [
        (r"/socket.io/", socketio.get_tornado_handler(sio)),
    ],
    # ... other application options
)


@sio.on("health-check")
async def common(sid, userRq):
    # Sending a response back to the client
    if type(userRq) is not dict:
        userRq = json.loads(userRq)
    print(f"recive: common: {userRq}")
    userId = userRq['userId']
    await sio.emit("re-health-check", json.dumps(
        {
            "userBody": userRq
        }
    ), room=sid)

@sio.event
async def connect(sid, environ, auth):
    print("connect ", sid)
    await sio.emit("message", f"connected {sid}", room=sid)
@sio.event
def disconnect(sid):
    print("disconnect", sid)

app.listen(3030)
tornado.ioloop.IOLoop.current().start()