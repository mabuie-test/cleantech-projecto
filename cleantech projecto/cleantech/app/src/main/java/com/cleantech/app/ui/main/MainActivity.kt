package com.cleantech.app.ui.main

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.cleantech.app.R
import com.cleantech.app.databinding.ActivityMainBinding
import com.cleantech.app.services.SocketManager
import com.cleantech.app.ui.order.CreateOrderActivity
import com.cleantech.app.ui.profile.ProfileActivity
import org.maplibre.gl.MapView
import org.maplibre.gl.maps.MapLibreMap
import org.maplibre.gl.maps.Style

class MainActivity : AppCompatActivity() {
private lateinit var binding: ActivityMainBinding
private lateinit var mapView: MapView
private var map: MapLibreMap? = null

private val reqLoc = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
if (!granted) Toast.makeText(this, "Permissão de localização necessária", Toast.LENGTH_SHORT).show()
}

override fun onCreate(savedInstanceState: Bundle?) {
super.onCreate(savedInstanceState)
binding = ActivityMainBinding.inflate(layoutInflater)
setContentView(binding.root)

mapView = binding.mapView
mapView.onCreate(savedInstanceState)
mapView.getMapAsync { mapbox ->
map = mapbox
mapbox.setStyle(Style.Builder().fromUri("https://demotiles.maplibre.org/style.json")) {
// adicionar layers/markers aqui
}
}

SocketManager.connect("https://YOUR_BACKEND_URL")
SocketManager.on("order_update") { /* process events */ }

binding.fabCreateOrder.setOnClickListener { startActivity(Intent(this, CreateOrderActivity::class.java)) }

if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
reqLoc.launch(Manifest.permission.ACCESS_FINE_LOCATION)
}
}

override fun onCreateOptionsMenu(menu: Menu?): Boolean { menuInflater.inflate(R.menu.main_menu, menu); return true }
override fun onOptionsItemSelected(item: MenuItem): Boolean {
return when(item.itemId) {
R.id.menu_profile -> { startActivity(Intent(this, ProfileActivity::class.java)); true }
else -> super.onOptionsItemSelected(item)
}
}

override fun onResume() { super.onResume(); mapView.onResume() }
override fun onStart()  { super.onStart();  mapView.onStart() }
override fun onPause()  { super.onPause();  mapView.onPause() }
override fun onStop()   { super.onStop();   mapView.onStop() }
override fun onLowMemory(){ super.onLowMemory(); mapView.onLowMemory() }
override fun onDestroy(){ super.onDestroy(); mapView.onDestroy(); SocketManager.disconnect() }
}