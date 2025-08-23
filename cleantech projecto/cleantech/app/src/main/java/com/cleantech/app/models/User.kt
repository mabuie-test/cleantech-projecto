package com.cleantech.app.models

data class User(
val id: String,
val name: String,
val phone: String,
val email: String? = null,
val role: String = "client",
val rating: Double = 0.0,
val verified: Boolean = false
)