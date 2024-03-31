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

onlineUsers = {}

@sio.on("health-check")
async def common(sid, userRq):
    # Sending a response back to the client
    if type(userRq) is not dict:
        userRq = json.loads(userRq)
    print(f"recive: common: {userRq}")
    userId = userRq['userId']
    await sio.emit("re-health-check", json.dumps(
        {
            "userBody": userRq,
            "sid": f"{sid}"
        }
    ), room=sid)

@sio.on("event01")
async def event01(sid, userRq):
    print(f"event01: {sid}")
    # Sending a response back to the client
    await sio.emit("event02", "event02 ok", room=sid)

@sio.on("add-user")
async def add_user(sid, userId: str):
    print(f"add_user: {sid}")
    onlineUsers[userId] = sid


@sio.on("create-node")
async def create_node(sid, userRq):
    if type(userRq) is not dict:
        userRq = json.loads(userRq)
    print(f"recive: common: {userRq}")

    if "activityId" not in userRq:
        await sio.emit("node-recieve",  userRq)
        return "node-done-1"

    await sio.emit(f"node-recieve-{userRq['activityId']}",  userRq)
    return "node-done-2"

@sio.on("create-edge")
async def create_edge(sid, userRq):
    if type(userRq) is not dict:
        userRq = json.loads(userRq)
    print(f"recive: common: {userRq}")

    if "activityId" not in userRq:
        await sio.emit("edge-recieve",  userRq)
        return "edge-done-1"

    await sio.emit(f"edge-recieve-{userRq['activityId']}",  userRq)
    return "edge-done-2"


@sio.event
async def connect(sid, environ, auth):
    print("connect ", sid)
    await sio.emit("message", f"connected {sid}", room=sid)
@sio.event
def disconnect(sid):
    print("disconnect", sid)

app.listen(3030)
tornado.ioloop.IOLoop.current().start()