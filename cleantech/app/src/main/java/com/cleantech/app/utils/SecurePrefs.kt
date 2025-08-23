package com.cleantech.app.utils

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import com.cleantech.app.App

object SecurePrefs {
private const val FILE = "secure_prefs"
private val ctx: Context get() = App.instance.applicationContext
private val master = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
private val prefs by lazy {
EncryptedSharedPreferences.create(
FILE, master, ctx,
EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
}
fun saveToken(token: String) = prefs.edit().putString("token", token).apply()
fun getToken(): String? = prefs.getString("token", null)
fun clear() = prefs.edit().clear().apply()
}