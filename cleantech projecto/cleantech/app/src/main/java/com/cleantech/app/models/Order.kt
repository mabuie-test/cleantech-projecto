package com.cleantech.app.models

data class Order(
val id: String,
val clientId: String,
val collectorId: String?,
val type: String,
val quantityKg: Double,
val address: String,
val lat: Double,
val lng: Double,
val distanceKm: Double,
val price: Double,
val status: String
)