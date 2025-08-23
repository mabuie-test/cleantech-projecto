package com.cleantech.app.ui.auth

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.cleantech.app.databinding.ActivityRegisterBinding
import com.cleantech.app.network.ApiClient
import com.cleantech.app.network.requests.AuthRequest
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
private lateinit var binding: ActivityRegisterBinding

override fun onCreate(savedInstanceState: Bundle?) {
super.onCreate(savedInstanceState)
binding = ActivityRegisterBinding.inflate(layoutInflater)
setContentView(binding.root)

binding.btnRegister.setOnClickListener { register() }
}

private fun register() {
val name = binding.etName.text.toString().trim()
val phone = binding.etPhone.text.toString().trim()
val password = binding.etPassword.text.toString().trim()
val role = if (binding.switchCollector.isChecked) "collector" else "client"

if (name.isEmpty() || phone.isEmpty() || password.isEmpty()) { toast("Complete os campos"); return }

binding.progress.visibility = View.VISIBLE
lifecycleScope.launch {
try {
val res = ApiClient.api.register(AuthRequest(name = name, phone = phone, password = password, role = role))
if (res.isSuccessful) { toast("Registo concluído. Faça login."); finish() } else toast("Erro no registo")
} catch (e: Exception) { toast("Erro: ${e.message}") }
finally { binding.progress.visibility = View.GONE }
}
}

private fun toast(s: String) = Toast.makeText(this, s, Toast.LENGTH_SHORT).show()
}