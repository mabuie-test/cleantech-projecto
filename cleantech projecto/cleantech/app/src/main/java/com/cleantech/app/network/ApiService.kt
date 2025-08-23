package com.cleantech.app.network

import com.cleantech.app.network.requests.AuthRequest
import com.cleantech.app.network.requests.CreateOrderRequest
import com.cleantech.app.network.responses.AuthResponse
import com.cleantech.app.models.Order
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
@POST("auth/register") suspend fun register(@Body req: AuthRequest): Response<AuthResponse>
@POST("auth/login")    suspend fun login(@Body req: AuthRequest): Response<AuthResponse>

@POST("orders") suspend fun createOrder(@Body req: CreateOrderRequest): Response<Order>
@GET("orders/client/{clientId}") suspend fun getClientOrders(@Path("clientId") clientId: String): Response<List<Order>>

@POST("payments/mpesa/init") suspend fun initMpesa(@Body payload: Map<String, Any>): Response<Map<String, Any>>
}