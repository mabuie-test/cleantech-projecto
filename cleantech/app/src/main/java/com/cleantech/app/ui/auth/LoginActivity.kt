package com.cleantech.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.cleantech.app.databinding.ActivityLoginBinding
import com.cleantech.app.network.ApiClient
import com.cleantech.app.network.requests.AuthRequest
import com.cleantech.app.network.responses.AuthResponse
import com.cleantech.app.ui.main.MainActivity
import com.cleantech.app.utils.SecurePrefs
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
private lateinit var binding: ActivityLoginBinding

override fun onCreate(savedInstanceState: Bundle?) {
super.onCreate(savedInstanceState)
binding = ActivityLoginBinding.inflate(layoutInflater)
setContentView(binding.root)

SecurePrefs.getToken()?.let { if (it.isNotBlank()) { startActivity(Intent(this, MainActivity::class.java)); finish() } }

binding.btnLogin.setOnClickListener { login() }
binding.tvRegister.setOnClickListener { startActivity(Intent(this, RegisterActivity::class.java)) }
}

private fun login() {
val phone = binding.etPhone.text.toString().trim()
val password = binding.etPassword.text.toString().trim()
if (phone.isEmpty() || password.isEmpty()) { toast("Preencha os campos"); return }

binding.progress.visibility = View.VISIBLE
lifecycleScope.launch {
try {
val res = ApiClient.api.login(AuthRequest(phone = phone, password = password))
if (res.isSuccessful) {
val body: AuthResponse? = res.body()
if (body != null) {
SecurePrefs.saveToken(body.token)
startActivity(Intent(this@LoginActivity, MainActivity::class.java))
finish()
} else toast("Resposta inválida do servidor")
} else toast("Credenciais inválidas")
} catch (e: Exception) { toast("Erro: ${e.message}") }
finally { binding.progress.visibility = View.GONE }
}
}

private fun toast(s: String) = Toast.makeText(this, s, Toast.LENGTH_SHORT).show()
}