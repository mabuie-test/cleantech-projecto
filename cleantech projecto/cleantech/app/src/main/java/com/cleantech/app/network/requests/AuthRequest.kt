package com.cleantech.app.network.requests

data class AuthRequest(
val name: String? = null,
val phone: String,
val password: String,
val role: String? = null
)