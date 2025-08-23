package com.cleantech.app.ui.profile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.cleantech.app.databinding.ActivityProfileBinding

class ProfileActivity : AppCompatActivity() {
private lateinit var binding: ActivityProfileBinding
override fun onCreate(savedInstanceState: Bundle?) {
super.onCreate(savedInstanceState)
binding = ActivityProfileBinding.inflate(layoutInflater)
setContentView(binding.root)
// TODO: carregar dados do usuário e histórico via ApiClient.api.getClientOrders(...)
}
}