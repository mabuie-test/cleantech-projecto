package com.cleantech.app.network.responses

import com.cleantech.app.models.User

data class AuthResponse(
val token: String,
val user: User
)