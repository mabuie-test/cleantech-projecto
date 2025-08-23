package com.cleantech.app.services

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

object SocketManager {
private var socket: Socket? = null

fun connect(baseUrl: String) {
try {
val opts = IO.Options().apply { reconnection = true; forceNew = true }
socket = IO.socket(baseUrl, opts).also {
it.on(Socket.EVENT_CONNECT) { Log.d("Socket", "connected") }
it.on(Socket.EVENT_CONNECT_ERROR) { e -> Log.e("Socket", "error: $e") }
it.connect()
}
} catch (e: Exception) { Log.e("Socket", "init error: ${e.message}") }
}

fun on(event: String, cb: (Array<Any>) -> Unit) { socket?.on(event) { cb(it) } }
fun emit(event: String, data: JSONObject) { socket?.emit(event, data) }
fun disconnect() { socket?.disconnect(); socket = null }
}