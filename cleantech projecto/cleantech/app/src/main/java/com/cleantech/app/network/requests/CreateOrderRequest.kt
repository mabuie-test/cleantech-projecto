package com.cleantech.app.network.requests

data class CreateOrderRequest(
val type: String,
val quantityKg: Double,
val address: String,
val lat: Double,
val lng: Double,
val distanceKm: Double,
val price: Double
)