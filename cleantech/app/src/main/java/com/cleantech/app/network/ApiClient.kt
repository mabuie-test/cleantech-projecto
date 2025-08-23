package com.cleantech.app.network

import com.cleantech.app.utils.SecurePrefs
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
private const val BASE_URL = "https://YOUR_BACKEND_URL/api/"

private class AuthInterceptor : Interceptor {
override fun intercept(chain: Interceptor.Chain) =
chain.proceed(
chain.request().newBuilder().apply {
SecurePrefs.getToken()?.let { addHeader("Authorization", "Bearer $it") }
addHeader("Accept", "application/json")
}.build()
)
}

private val client = OkHttpClient.Builder()
.addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY })
.addInterceptor(AuthInterceptor())
.connectTimeout(30, TimeUnit.SECONDS)
.readTimeout(30, TimeUnit.SECONDS)
.build()

val api: ApiService = Retrofit.Builder()
.baseUrl(BASE_URL)
.client(client)
.addConverterFactory(GsonConverterFactory.create())
.build()
.create(ApiService::class.java)
}