package com.cleantech.app.ui.order

import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.cleantech.app.databinding.ActivityCreateOrderBinding
import com.cleantech.app.network.ApiClient
import com.cleantech.app.network.requests.CreateOrderRequest
import kotlinx.coroutines.launch
import kotlin.math.max

class CreateOrderActivity : AppCompatActivity() {
private lateinit var binding: ActivityCreateOrderBinding

override fun onCreate(savedInstanceState: Bundle?) {
super.onCreate(savedInstanceState)
binding = ActivityCreateOrderBinding.inflate(layoutInflater)
setContentView(binding.root)

val types = listOf("domestico","reciclavel","entulho","especial")
binding.spType.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, types)

binding.btnCalculate.setOnClickListener { binding.tvPrice.text = "Preço: ${calcPrice()} MT" }
binding.btnCreate.setOnClickListener { createOrder() }
}

private fun calcPrice(): Int {
val type = binding.spType.selectedItem.toString()
val kg = binding.etQuantityKg.text.toString().toDoubleOrNull() ?: 0.0
val distance = binding.etDistanceKm.text.toString().toDoubleOrNull() ?: 0.0
val (base, perKg, perKm) = when(type){
"domestico" -> Triple(100.0,5.0,10.0)
"reciclavel"-> Triple(80.0,3.0,8.0)
"entulho"   -> Triple(150.0,7.0,12.0)
"especial"  -> Triple(200.0,10.0,15.0)
else -> Triple(100.0,5.0,10.0)
}
val extra = max(0.0, distance - 2.0)
return (base + kg*perKg + extra*perKm).toInt()
}

private fun createOrder() {
val req = CreateOrderRequest(
type = binding.spType.selectedItem.toString(),
quantityKg = binding.etQuantityKg.text.toString().toDoubleOrNull() ?: 0.0,
address = binding.etAddress.text.toString(),
lat = 0.0, lng = 0.0,
distanceKm = binding.etDistanceKm.text.toString().toDoubleOrNull() ?: 0.0,
price = calcPrice().toDouble()
)
if (req.address.isBlank()) { toast("Indique o endereço"); return }

binding.progress.visibility = View.VISIBLE
lifecycleScope.launch {
try {
val res = ApiClient.api.createOrder(req)
if (res.isSuccessful) {
toast("Pedido criado. Confirme pagamento via M-Pesa.")
// Opcional: chamar ApiClient.api.initMpesa(...) para iniciar C2B via backend
finish()
} else toast("Erro ao criar pedido")
} catch (e: Exception) { toast("Erro: ${e.message}") }
finally { binding.progress.visibility = View.GONE }
}
}

private fun toast(s: String) = Toast.makeText(this, s, Toast.LENGTH_SHORT).show()
}